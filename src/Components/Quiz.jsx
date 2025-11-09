 // src/Components/Quiz.jsx
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";
import client from "../geminiClient/gemini";
import classData from "./classData";

// Components
import QuizSetup from "./QuizSetup";
import QuizPlay from "./QuizPlay";
import QuizResult from "./QuizResult";

// Coin utils
import { addCoins, getCoins, deductCoins } from "../utils/coinUtils";
import {updateStreak} from "../utils/streakUtils";

// --- SHUFFLE UTILS (Prevents answer pattern like B,B,C,C) ---
function shuffleArray(arr) {
  return arr
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((x) => x.v);
}


export default function Quiz() {
  const { user } = useUser();
  const navigate = useNavigate();

  // --- STATE ---
  const [step, setStep] = useState(1);
  const [studentClass, setStudentClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [quizResultId, setQuizResultId] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  const timerRef = useRef(0);

  // --- TIMER ---
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeSeconds((t) => {
          const next = t + 1;
          timerRef.current = next;
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // --- EXTRACT TEXT FROM GEMINI RESPONSE ---
  async function extractTextFromGeminiResponse(resp) {
    try {
      return (
        resp?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        resp?.text ||
        ""
      );
    } catch {
      return "";
    }
  }

  // --- QUIZ GENERATION PROMPT (20Q) ---
  const buildQuizPrompt = () => `
You are an experienced CBSE teacher and AI question setter.
Create 20 multiple-choice questions for Class ${studentClass} students.

Focus only on the following subjects and chapters:
${subjects.map((s) => `- ${s}: ${chapters[s]}`).join("\n")}

Requirements:
- Each question tests one clear concept or fact.
- Mix difficulty: 10 easy, 8 medium, 2 challenge-level questions.
- Each question must have exactly 4 options (A–D) and one correct answer.
- Avoid similar or repetitive questions.

Return output strictly in valid JSON only, no markdown or explanation.
Format:
[
  {"question": "string", "options": ["A","B","C","D"], "answer": "A"},
  {"question": "...", "options": ["..."], "answer": "B"}
]

Rules:
- Questions must be under 25-30 words.
- Ensure correct spelling and clarity.
`;

  // --- GENERATE QUIZ ---
  const generateQuizWithGemini = async () => {
    if (!studentClass || subjects.length === 0) {
      setError("Please select your class and at least one subject.");
      return;
    }
    for (const s of subjects) {
      if (!chapters[s]) {
        setError(`Please select a chapter for ${s}.`);
        return;
      }
    }

    setLoading(true);
    setError("");
    setQuiz([]);
    setCurrentIndex(0);
    setScore(0);
    setUserAnswers([]);
    setQuizResultId(null);

    const prompt = buildQuizPrompt();

    console.time("Gemini Quiz Generation");

    try {
      const resp = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      console.timeEnd("Gemini Quiz Generation");

      const text = await extractTextFromGeminiResponse(resp);
      const clean = text.replace(/```json|```/g, "").trim();
      const fixed = clean.endsWith("]") ? clean : clean + "]";
      const parsed = JSON.parse(fixed);

      if (!Array.isArray(parsed) || parsed.length === 0)
        throw new Error("Invalid quiz format.");

       // ✅ Shuffle options & update correct answer mapping
const shuffledQuiz = parsed.map((q) => {
  const originalOptions = [...q.options];
  const shuffledOptions = shuffleArray(originalOptions);

  // find old correct answer index (A=0, B=1...)
  const correctLetter = (q.answer || "").toUpperCase();
  const oldIndex =
    /^[A-D]$/.test(correctLetter)
      ? correctLetter.charCodeAt(0) - 65
      : 0;

  const correctOption = originalOptions[oldIndex];
  const newIndex = shuffledOptions.indexOf(correctOption);

  return {
    question: q.question,
    options: shuffledOptions,
    answer: ["A", "B", "C", "D"][newIndex],
  };
});

setQuiz(shuffledQuiz);

      setStep(2);
      setTimeSeconds(0);
      timerRef.current = 0;
      setTimerRunning(true);
    } catch (err) {
      console.error("Gemini quiz error:", err);
      setError("AI couldn't generate a quiz right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 
 // --- SAVE QUIZ RESULT (+5 COINS + STREAK) ---
const saveQuizResult = async (finalScore = null) => {
  if (!user) return;
  setSaving(true);

  try {
    const scoreToSave = finalScore ?? score;
    const currentTime = timerRef.current || timeSeconds || 0;
    const duration_minutes = Math.ceil(currentTime / 60);

    const payload = {
      user_id: user.id,
      topic: subjects.map((s) => `${s}: ${chapters[s]}`).join(", "),
      score: scoreToSave,
      total_questions: quiz.length,
      time_seconds: currentTime,
      duration_minutes,
      created_at: new Date(),
    };

    const { data, error } = await supabase
      .from("quiz_data")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    if (data?.id) setQuizResultId(data.id);

    // ✅ Add coins
    await addCoins(user.id, 5);
    console.log("✅ +5 coins added");

    // ✅ Update streak (VERY IMPORTANT)
    await updateStreak(user.id);
    console.log("🔥 Streak updated");

  } catch (err) {
    console.error("Save error:", err);
    setError("Failed to save quiz results.");
  } finally {
    setSaving(false);
  }
};

  // --- ANSWER HANDLING ---
  const handleChoose = (opt) => {
    if (!quiz[currentIndex] || selectedOption) return;

    const correctLetter = (quiz[currentIndex].answer || "").toUpperCase();
    const correctIdx = /^[A-D]$/.test(correctLetter)
      ? correctLetter.charCodeAt(0) - 65
      : -1;
    const correctOpt =
      correctIdx >= 0 ? quiz[currentIndex].options[correctIdx] : null;

    const isCorrect = opt === correctOpt;
    const newScore = isCorrect ? score + 1 : score;

    setSelectedOption(opt);
    setUserAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = opt;
      return updated;
    });
    setScore(newScore);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex < quiz.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setTimerRunning(false);
        setStep(3);
        saveQuizResult(newScore);
      }
    }, 800);
  };

  // --- EXPLANATION PROMPT ---
  const buildExplainPrompt = (q, studentClass) => `
You are a CBSE subject expert helping a student quickly understand their mistake.

Question: ${q.question}
User Answer: ${q.user_answer}
Correct Answer: ${q.correct_answer}

Give the explanation in exactly 3 numbered lines.
Follow this strict format:
1) Correct Concept: [short and clear, 1 sentence only]
2) Why Incorrect: [1 sentence explaining student's confusion]
3) Trick to Remember: [1 short memory tip or rule]

Rules:
- Output only plain text, no markdown or greetings.
- Each point must start with 1), 2), 3).
- Keep total under 70 words.
- Be accurate and encouraging.
`;

  // --- GENERATE EXPLANATIONS (−10 COINS) ---
  const handleExplain = async () => {
    if (!user) return setError("Please log in to unlock explanations.");
    if (!quizResultId) return setError("Quiz result not found. Try again.");

    setLoading(true);

    try {
      const balance = await getCoins(user.id);
      if (balance < 10) {
        setError("Not enough coins (need 10). Earn more by completing quizzes!");
        setLoading(false);
        return;
      }

      await deductCoins(user.id, 10);
      console.log("💸 −10 coins deducted for explanations");

      const wrongQuestions = quiz
        .map((q, i) => {
          const correctLetter = (q.answer || "").toUpperCase();
          const correctIndex = /^[A-D]$/.test(correctLetter)
            ? correctLetter.charCodeAt(0) - 65
            : -1;
          const correctOption =
            correctIndex >= 0 ? q.options[correctIndex] : null;

          return userAnswers[i] !== correctOption
            ? {
                question: q.question,
                correct_answer: correctOption,
                user_answer: userAnswers[i] || "Not answered",
              }
            : null;
        })
        .filter(Boolean);

      for (const q of wrongQuestions) {
        const expPrompt = buildExplainPrompt(q, studentClass);

        const resp = await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: expPrompt,
        });

        const text = await extractTextFromGeminiResponse(resp);
        const explanation = text.replace(/```/g, "").trim();

        await supabase.from("quiz_explanations").insert([
          {
            user_id: user.id,
            quiz_id: quizResultId,
            question: q.question,
            correct_answer: q.correct_answer,
            user_answer: q.user_answer,
            explanation,
          },
        ]);
      }

      navigate(`/quiz-explain/${quizResultId}`);
    } catch (err) {
      console.error("Explain error:", err);
      setError("Couldn't generate explanations. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- RESET QUIZ ---
  const resetQuiz = () => {
    setStep(1);
    setQuiz([]);
    setScore(0);
    setUserAnswers([]);
    setError("");
    setCurrentIndex(0);
    setTimeSeconds(0);
    timerRef.current = 0;
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="w-full max-w-3xl">
        {step === 1 && (
          <QuizSetup
            classData={classData}
            studentClass={studentClass}
            setStudentClass={setStudentClass}
            subjects={subjects}
            setSubjects={setSubjects}
            chapters={chapters}
            setChapters={setChapters}
            loading={loading}
            onGenerate={generateQuizWithGemini}
            onCancel={resetQuiz}
          />
        )}

        {step === 2 && quiz.length > 0 && (
          <QuizPlay
            quiz={quiz}
            currentIndex={currentIndex}
            score={score}
            selectedOption={selectedOption}
            handleChoose={handleChoose}
            loading={loading}
            timerSeconds={timeSeconds}
            onBackHome={() => navigate("/dashboard")}
          />
        )}

        {step === 3 && (
          <QuizResult
            score={score}
            total={quiz.length}
            saving={saving}
            error={error}
            timeSeconds={timeSeconds}
            onRetry={resetQuiz}
            onExplain={handleExplain}
            onBackHome={() => navigate("/dashboard")}
            loading={loading}
          />
        )}

        {loading && step === 3 && (
          <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
            <div className="bg-white shadow-lg rounded-xl p-6 text-center">
              <div className="animate-spin h-6 w-6 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-700 font-medium">
                Generating explanations...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
