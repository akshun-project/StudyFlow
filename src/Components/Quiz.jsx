// src/components/Quiz.jsx
import React, { useState } from "react";
import client from "../geminiClient/gemini";
import { supabase } from "../Supabase/supabaseClient"; // named import (must match file above)
import { useUser } from "@clerk/clerk-react";

export default function Quiz() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [checkedResponse, setCheckedResponse] = useState(null);
  const [studentClass, setStudentClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  React.useEffect(() => {
    let interval = null;

    if (timerRunning) {
      interval = setInterval(() => {
        setTimeSeconds((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerRunning]);

  const classData = {
    10: {
      subjects: [
        "Math",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "History",
        "Geography",
        "PoliticalScience",
        "Economics",
      ],
      chapters: {
        Math: [
          "Chapter 1: Real Numbers",
          "Chapter 2: Polynomials",
          "Chapter 3: Pair Of Linear Equations In Two Variables",
          "Chapter 4: Quadratic Equations",
          "Chapter 5: Arithmetic Progressions",
          "Chapter 6: Triangles",
          "Chapter 7: Coordinate Geometry",
          "Chapter 8: Introduction To Trigonometry",
          "Chapter 9: Some Applications Of Trigonometry",
          "Chapter 10: Circles",
          "Chapter 11: Areas Related To Circles",
          "Chapter 12: Surface Areas And Volumes",
          "Chapter 13: Statistics",
          "Chapter 14: Probability",
        ],
        Physics: [
          "CHAPTER 1: Light-Reflection and Refraction",
          "CHAPTER 2:The Human Eye And The Colourful World",
          "CHAPTER 3:Electricity",
          "CHAPTER 4: Magnetic Effects Of Electric Current",
          "CHAPTER 5: Sources Of Energy",
          "CHAPTER 6: Our Environment",
        ],
        Chemistry: [
          "Chapter 1: Chemical Reactions and Equations",
          "Chapter 2: Acids, Bases and Salts",
          "Chapter 3: Metals and Non-metals",
          "Chapter 4: Carbon and its Compounds",
        ],
        Biology: [
          "Chapter 1: Life Process",
          "Chapter 2: Control and Coordination",
          "Chapter 3: Reproduction",
          "Chapter 4: Heredity",
          "Chapter 5: Our Environment",
        ],

        English: [
          "A Letter to God",
          "Nelson Mandela: Long Walk to Freedom",
          "From the Diary of Anne Frank",
          "The Hundred Dresses – I & II",
          "Mijbil the Otter",
          "Madam Rides the Bus",
          "The Sermon at Benares",
          "The Proposal",
          "Dust of Snow",
          "Fire and Ice",
          "A Tiger in the Zoo",
          "How to Tell Wild Animals",
          "The Ball Poem",
          "A Triumph of Surgery",
          "The Midnight Visitor",
          "The Thief’s Story",
          "Bholi",
        ],

        History: [
          "The Rise of Nationalism in Europe",
          "Nationalism in India",
          "The Making of a Global World",
          "The Age of Industrialization",
          "Print Culture and the Modern World",
        ],

        Geography: [
          "Resources and Development",
          "Forest and Wildlife Resources",
          "Water Resources",
          "Agriculture",
          "Minerals and Energy Resources",
          "Manufacturing Industries",
          "Lifelines of National Economy",
        ],

        PoliticalScience: [
          "Power Sharing",
          "Federalism",
          "Gender, Religion and Caste",
          "Political Parties",
          "Outcomes of Democracy",
        ],

        Economics: [
          "Development",
          "Sectors of the Indian Economy",
          "Money and Credit",
          "Globalisation and the Indian Economy",
          "Consumer Rights",
        ],
      },
    },
    11: {
      subjects: [
        "Math",
        "Physics",
        "Chemistry",
        "Botany",
        "Zoology",
        "Genetics",
        "Economics",
      ],
      chapters: {
        Math: [
          "Sets",
          "Relations and Functions",
          "Trigonometric Functions",
          "Complex Numbers",
          "Linear Inequalities",
          "Permutations and Combinations",
          "Binomial Theorem",
          "Sequence and Series",
          "Straight Lines",
          "Conic Sections",
          "Introduction to Three Dimensional Geometry",
          "Limits and Derivatives",
          "Statistics",
          "Probability",
        ],

        Physics: [
          "Physical World",
          "Units and Measurements",
          "Motion in a Straight Line",
          "Motion in a Plane",
          "Laws of Motion",
          "Work, Energy and Power",
          "System of Particles and Rotational Motion",
          "Gravitation",
          "Mechanical Properties of Solids",
          "Mechanical Properties of Fluids",
          "Thermal Properties of Matter",
          "Thermodynamics",
          "Kinetic Theory",
          "Oscillations",
          "Waves",
        ],

        Chemistry: [
          "Some Basic Concepts of Chemistry",
          "Structure of Atom",
          "Classification of Elements",
          "Chemical Bonding",
          "Thermodynamics",
          "Equilibrium",
          "Redox Reactions",
          "General organic chemistry (GOC)",
          "Hydrocarbons",
        ],
        Botany: [
          "The Living World",
          "Biological Classification",
          "Plant Kingdom",
          "Morphology of Flowering Plants",
          "Anatomy of Flowering Plants",
          "Transport in Plants",
          "Mineral Nutrition",
          "Photosynthesis in Higher Plants",
          "Respiration in Plants",
          "Plant Growth and Development",
        ],

        Zoology: [
          "Animal Kingdom",
          "Structural Organisation in Animals",
          "Digestion and Absorption",
          "Breathing and Exchange of Gases",
          "Body Fluids and Circulation",
          "Excretory Products and Their Elimination",
          "Locomotion and Movement",
          "Neural Control and Coordination",
          "Chemical Coordination and Integration",
        ],

        Genetics: [
          // --- Cell Biology and Biomolecules ---
          "Cell: The Unit of Life",
          "Biomolecules",
          "Cell Cycle and Cell Division",
        ],
        Economics: [
          "Introduction to Microeconomics",
          "Consumer's Equilibrium and Demand",
          "Producer Behaviour and Supply",
          "Forms of Market and Price Determination under Perfect Competition with Simple Applications",
          "Introduction to Statistics for Economics",
          "Collection, Organisation and Presentation of Data",
          "Statistical Tools and Interpretation",
        ],
      },
    },
    12: {
      subjects: [
        "Math",
        "Physics",
        "Chemistry",
        "Botany",
        "Zoology",
        "GeneticsAndEvolution",
        "English",
      ],
      chapters: {
        Math: [
          "Relations and Functions",
          "Inverse Trigonometric Functions",
          "Matrices",
          "Determinants",
          "Continuity and Differentiability",
          "Application of Derivatives",
          "Integration",
          "Application of Integral",
          "Differential Equations",
          "Vector Algebra",
          "Three Dimensional Geometry",
          "Linear Programming",
          "Probability",
        ],
        Physics: [
          // --- Electrostatics & Current Electricity ---
          "Electrostatics",
          "Electric Potential and Capacitance",
          "Current Electricity",
          "Moving Charges and Magnetism",
          "Magnetism and Matter",
          "Electromagnetic Induction",
          "Alternating Currents",
          "Ray Optics",
          "Wave Optics",
          "Dual Nature of Matter and Radiation",
          "Atoms",
          "Nuclei",
          "Semiconductor",
        ],

        Chemistry: [
          "Solutions",
          "Electrochemistry",
          "Chemical Kinetics",
          "The d-Block Elements",
          "The Organic Chemistry - Some Basic Principles",
          "Hydrocarbons",
          "Alcohols, Phenols and Ethers",
          "The Chemistry of Aldehydes, Ketones and Carboxylic Acids",
          "Amines",
          "Biomolecules",
        ],
        Botany: [
          "Reproduction in Plants",
          "Plant Growth and Development",
          "Photosynthesis",
          "Respiration in Plants",
          "Transport in Plants",
          "Mineral Nutrition",
          "Plant Hormones",
        ],

        Zoology: [
          "Human Reproduction",
          "Reproductive Health",
          "Human Development",
          "Blood and Circulation",
          "Excretory Products and Their Elimination",
          "Muscle and Movement",
          "Neural Control and Coordination",
          "Chemical Coordination and Integration",
          "Locomotion and Movement",
          "Respiration in Humans",
          "Digestion and Absorption",
          "Breathing and Exchange of Gases",
        ],

        GeneticsAndEvolution: [
          "DNA Replication and Recombination",
          "Structure of Gene and Chromosomes",
          "Mendelian Inheritance",
          "Molecular Genetics",
          "Evolution",
          "Human Genetics and Biotechnology",
          "Biotechnology Principles and Processes",
          "Biotechnology and Its Applications",
        ],
        English: [
          "The Last Lesson",
          "Lost Spring",
          "Deep Water",
          "The Rattrap",
          "Indigo",
          "Poets and Pancakes",
          "The Interview",
          "Going Places",
          "My Mother at Sixty-Six",
          "An Elementary School Classroom in a Slum",
          "Keeping Quiet",
          "A Thing of Beauty",
          "A Roadside Stand",
          "Aunt Jennifer's Tigers",
          "The Third Level",
          "The Tiger King",
          "Journey to the End of the Earth",
          "The Enemy",
          "Should Wizard Hit Mommy?",
          "On the Face of It",
          "Evans Tries an O-Level",
        ],
      },
    },
  };

  const toggleSubject = (s) => {
    if (subjects.includes(s)) {
      const newSubjects = subjects.filter((x) => x !== s);
      const newChapters = { ...chapters };
      delete newChapters[s];
      setSubjects(newSubjects);
      setChapters(newChapters);
    } else {
      if (subjects.length >= 3) return;
      setSubjects([...subjects, s]);
    }
  };

  const handleChapterChange = (subject, chapter) => {
    setChapters({ ...chapters, [subject]: chapter });
  };

  const resetQuizState = () => {
    setQuiz([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setError("");
  };

  async function extractTextFromResponse(gemResp) {
    try {
      if (!gemResp) return "";
      if (typeof gemResp === "string") return gemResp;
      if (typeof gemResp.text === "function") return await gemResp.text();
      if (typeof gemResp.text === "string") return gemResp.text;
      if (gemResp.response && typeof gemResp.response.text === "function")
        return await gemResp.response.text();
    } catch (e) {
      console.warn("extractTextFromResponse fallback:", e);
    }
    return "";
  }

  const generateQuizWithGemini = async () => {
    setError("");
    if (!studentClass || subjects.length === 0) {
      setError("Please choose a class and at least one subject (max 3).");
      return;
    }
    for (const s of subjects) {
      if (!chapters[s]) {
        setError(`Please pick a chapter for ${s}.`);
        return;
      }
    }

    setLoading(true);
    resetQuizState();

    try {
      const prompt = `
You are a friendly school tutor.
Create 20 multiple-choice questions for a Class ${studentClass} student.
Subjects and chapters:
${subjects.map((s) => `- ${s}: ${chapters[s]}`).join("\n")}
Return ONLY JSON:
[
  {"question": "...", "options": ["A","B","C","D"], "answer": "A"}
]`;

      const resp = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = await extractTextFromResponse(resp);
      let parsed = null;
      try {
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        if (start !== -1 && end !== -1 && end > start) {
          const raw = text.slice(start, end + 1);
          parsed = JSON.parse(raw);
        } else {
          parsed = JSON.parse(text);
        }
      } catch (e) {
        console.warn("Parse failed:", e, "raw:", text);
      }

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError("AI returned unexpected format; showing fallback quiz.");
        parsed = [
          {
            question: "Placeholder question",
            options: ["A", "B", "C", "D"],
            answer: "A",
          },
        ];
      }

      // Normalize minimal shape if needed (ensure options array)
      const normalized = parsed.map((q) => {
        const question = q.question || q.prompt || "Question";
        let options = q.options || q.choices || [];
        if (!Array.isArray(options))
          options =
            typeof options === "string"
              ? options
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];
        while (options.length < 4) options.push(`Option ${options.length + 1}`);
        let answer = (q.answer || q.correct || "").toString().trim();
        if (!/^[A-D]$/i.test(answer)) answer = "A";
        return {
          question,
          options: options.slice(0, 4),
          answer: answer.toUpperCase(),
        };
      });

      setQuiz(normalized);
      setStep(5);
      setTimeSeconds(0);
      setTimerRunning(true);
    } catch (err) {
      console.error("Gemini error:", err);
      setError("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = (opt) => {
    if (!quiz[currentIndex] || selectedOption) return;
    setSelectedOption(opt);
    const correctLetter = (quiz[currentIndex].answer || "").toUpperCase();
    const idx = quiz[currentIndex].options.indexOf(opt);
    const selectedLetter = idx >= 0 ? String.fromCharCode(65 + idx) : null;
    const isCorrect =
      selectedLetter === correctLetter ||
      (opt &&
        opt.toLowerCase() === (quiz[currentIndex].answer || "").toLowerCase());
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex < quiz.length - 1) setCurrentIndex((i) => i + 1);
      else {
        setStep(6);
        saveQuizResult(); // save on completion
        setTimerRunning(false);
      }
    }, 800);
  };

  // ✅ FIXED & CLEAN VERSION → paste this
  async function saveQuizResult() {
    try {
      setSaving(true);

      if (!user) {
        console.warn("No Clerk user logged in — skipping save.");
        return;
      }

      const userId = user.id;
      const topic = subjects.map((s) => `${s}: ${chapters[s]}`).join(", ");

      const { error: insertErr } = await supabase.from("quiz_data").insert([
        {
          user_id: userId,
          topic,
          score,
          total_questions: quiz.length,
          time_seconds: timeSeconds,
          duration_minutes: Math.round(timeSeconds / 60),
          created_at: new Date(),
        },
      ]);

      if (insertErr) throw insertErr;

      console.log("✅ Quiz saved successfully!");
    } catch (err) {
      console.error("❌ Failed to save quiz:", err);
      setError("Couldn't save quiz data.");
    } finally {
      setSaving(false);
    }
  }

  const restartAll = () => {
    setStep(1);
    setCheckedResponse(null);
    setStudentClass("");
    setSubjects([]);
    setChapters({});
    resetQuizState();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-indigo-700">
            StudyFlow — Daily Quiz
          </h1>
          <div className="text-sm text-gray-500">Keep your streak alive ✨</div>
        </div>

        {step === 1 && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-3">
              Did you complete today’s plan?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setCheckedResponse("yes");
                  setStep(2);
                }}
                className="px-6 py-3 bg-green-500 text-white rounded-lg"
              >
                Yes ✅
              </button>
              <button
                onClick={() => {
                  setCheckedResponse("no");
                  setStep(2);
                }}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg"
              >
                Not yet 💪
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="py-6">
            <div
              className={`p-4 rounded-lg mb-6 ${
                checkedResponse === "yes"
                  ? "bg-green-50 border border-green-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <h3 className="font-semibold mb-2">
                {checkedResponse === "yes"
                  ? "Awesome — keep it up!"
                  : "No worries — small steps matter!"}
              </h3>
              <p className="text-gray-700">
                {checkedResponse === "yes"
                  ? "You did great today. Let’s test what you learned!"
                  : "Let’s do a short quiz to build momentum — you got this!"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Class
              </label>
              <select
                value={studentClass}
                onChange={(e) => {
                  setStudentClass(e.target.value);
                  setSubjects([]);
                  setChapters({});
                }}
                className="w-full border rounded-md p-2"
              >
                <option value="">Choose Class</option>
                {Object.keys(classData).map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>

            {studentClass && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Subjects (max 3)
                </label>
                <div className="flex flex-wrap gap-3">
                  {classData[studentClass].subjects.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`px-3 py-2 rounded-md border ${
                        subjects.includes(s)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tip: choose up to 3 subjects to generate a focused quiz.
                </p>
              </div>
            )}

            {subjects.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Choose one chapter per selected subject
                </label>
                <div className="space-y-3">
                  {subjects.map((s) => (
                    <div key={s}>
                      <div className="font-medium mb-1">{s}</div>
                      <select
                        value={chapters[s] || ""}
                        onChange={(e) => handleChapterChange(s, e.target.value)}
                        className="w-full border rounded-md p-2"
                      >
                        <option value="">Choose Chapter for {s}</option>
                        {classData[studentClass].chapters[s].map((ch) => (
                          <option key={ch} value={ch}>
                            {ch}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={generateQuizWithGemini}
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate Quiz"}
              </button>
              <button
                onClick={restartAll}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        )}

        {step === 5 && quiz.length > 0 && (
          <div className="py-4">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-gray-600">
                Question {currentIndex + 1} / {quiz.length}
              </div>
              <div className="text-sm font-semibold text-indigo-700">
                Score: {score}
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="text-lg font-medium mb-4">
                {quiz[currentIndex]?.question}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(quiz[currentIndex]?.options || []).map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const letter = String.fromCharCode(65 + idx);
                  const correctLetter = (
                    quiz[currentIndex].answer || ""
                  ).toUpperCase();
                  const correctIdx = /^[A-D]$/.test(correctLetter)
                    ? correctLetter.charCodeAt(0) - 65
                    : -1;
                  const correctOpt =
                    correctIdx >= 0
                      ? quiz[currentIndex].options[correctIdx]
                      : null;

                  let style = "bg-white hover:bg-indigo-50 border";
                  if (selectedOption) {
                    if (isSelected) {
                      style =
                        opt === correctOpt
                          ? "bg-green-100 border-green-400 text-green-800"
                          : "bg-red-100 border-red-400 text-red-800";
                    } else if (opt === correctOpt) {
                      style = "bg-green-50 border-green-200 text-green-700";
                    } else style = "bg-white border";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={!!selectedOption}
                      onClick={() => {
                        setSelectedOption(opt);
                        handleChoose(opt);
                      }}
                      className={`text-left p-3 rounded-md ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center font-semibold text-sm">
                          {letter}
                        </div>
                        <div>{opt}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="py-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Quiz Completed 🎉</h3>
            <p className="text-gray-700 mb-4">
              You scored <span className="font-semibold">{score}</span> /{" "}
              <span className="font-semibold">{quiz.length}</span>.
            </p>

            {saving ? (
              <p className="text-indigo-600">Saving your result...</p>
            ) : (
              <p className="text-green-600 font-medium">
                Saved to your progress ✅
              </p>
            )}

            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => {
                  setStep(2);
                  resetQuizState();
                }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-md"
              >
                Take another quiz
              </button>
              <button
                onClick={restartAll}
                className="px-4 py-2 border rounded-md"
              >
                Back home
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
