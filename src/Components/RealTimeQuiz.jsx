 // src/Components/RealTimeQuiz.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { useUser } from "@clerk/clerk-react";
import BoardTestResult from "./BoardTestResult";

/* 🔀 shuffle helper (PURE, SAFE) */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function RealTimeQuiz({ quiz, onExit }) {
  const { user } = useUser();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);

  /* ✅ SHUFFLED QUESTIONS (ONCE PER TEST) */
  const [shuffledQuestions] = useState(() =>
    shuffleArray(quiz.questions)
  );

  const timerRef = useRef(null);
  const savedRef = useRef(false);

  /* ✅ USE SHUFFLED QUESTIONS HERE */
  const q = shuffledQuestions[index];

  // Timer (UNCHANGED)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Option click (UNCHANGED)
  const handleSelect = (optIndex) => {
    setSelected(optIndex);

    if (optIndex === q.correctIndex) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setSelected(null);
    }, 850);
  };

  // Save once (UNCHANGED)
  const saveResult = async () => {
    if (!user || savedRef.current) return;

    savedRef.current = true;

    await supabase.from("board_results").insert({
      user_id: user.id,
      class: quiz.class,
      test_id: quiz.id,
      test_name: quiz.title,
      total_questions: quiz.questions.length,
      correct_answers: score,
      time_taken: seconds,
      accuracy: Math.round((score / quiz.questions.length) * 100),
    });
  };

  // End test (UNCHANGED)
  if (!q) {
    clearInterval(timerRef.current);
    saveResult();
    return (
      <BoardTestResult
        score={score}
        total={quiz.questions.length}
        timeSeconds={seconds}
        onBack={onExit}
        onHome={() => (window.location.href = "/")}
      />
    );
  }

  /* 🔽 UI BELOW IS 100% UNTOUCHED 🔽 */

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Sticky top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-slate-200">
        <div className="max-w-xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={onExit}
            className="text-slate-600 text-sm font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition"
          >
            ← Exit
          </button>

          <p className="font-semibold text-slate-800 text-sm">
            Q {index + 1}/{quiz.questions.length}
          </p>

          <div className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shadow-sm">
            {Math.floor(seconds / 60)}:
            {(seconds % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 pt-24">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5 animate-fadeIn">

          {quiz.scenario && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl shadow-sm">
              <h3 className="font-semibold text-indigo-700 mb-2 text-sm">
                Passage
              </h3>
              <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                {quiz.scenario}
              </p>
            </div>
          )}

          <h2 className="text-base font-semibold text-slate-900 leading-snug">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isCorrect = selected !== null && i === q.correctIndex;
              const isWrong = selected === i && i !== q.correctIndex;

              return (
                <button
                  key={i}
                  disabled={selected !== null}
                  onClick={() => handleSelect(i)}
                  className={`
                    w-full text-left p-4 rounded-xl border transition-all duration-200
                    text-[15px] font-medium
                    ${
                      selected === null
                        ? "border-slate-300 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] shadow-sm"
                        : isCorrect
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-md scale-[1.01]"
                        : isWrong
                        ? "bg-red-50 border-red-400 text-red-700 shadow-md scale-[1.01]"
                        : "bg-slate-50 border-slate-200 opacity-50"
                    }
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
