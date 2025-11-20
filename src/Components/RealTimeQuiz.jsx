 // src/Components/RealTimeQuiz.jsx
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { useUser } from "@clerk/clerk-react";
import BoardTestResult from "./BoardTestResult";

export default function RealTimeQuiz({ quiz, onExit }) {
  const { user } = useUser();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const timerRef = useRef(null);
  const savedRef = useRef(false);

  const q = quiz.questions[index];

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Option click
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

  // Save once
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
      accuracy: Math.round((score / quiz.questions.length) * 100)
    });
  };

  // End test
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

  return (
    <div className="max-w-xl mx-auto px-4 pt-20 pb-16">

      {/* Mobile exit */}
      <button
        onClick={onExit}
        className="fixed top-4 left-4 z-50 md:hidden bg-white/95 backdrop-blur border border-slate-300 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 shadow hover:bg-slate-100"
      >
        ← Exit
      </button>

      {/* Main test card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5 transition-all">

        {/* TOP Bar: Question count + Timer */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-[13px] font-medium text-slate-500">
            Question {index + 1} / {quiz.questions.length}
          </p>

          <div className="px-3 py-1 rounded-full text-[12px] bg-indigo-100 text-indigo-700 font-semibold shadow-sm">
            {Math.floor(seconds / 60)}:
            {(seconds % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* PASSAGE BOX 🔥 PREMIUM */}
        {quiz.scenario && (
          <div className="p-4 bg-gradient-to-b from-indigo-50 to-white border border-indigo-200 rounded-xl shadow-sm">
            <h3 className="font-semibold text-indigo-700 mb-2 text-sm">Passage</h3>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
              {quiz.scenario}
            </p>
          </div>
        )}

        {/* QUESTION */}
        <div>
          <h2 className="text-base font-semibold text-slate-900 leading-snug mb-4">
            {q.question}
          </h2>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const isCorrect = selected !== null && i === q.correctIndex;
            const isWrong = selected === i && i !== q.correctIndex;

            return (
              <button
                key={i}
                disabled={selected !== null}
                onClick={() => handleSelect(i)}
                className={`w-full text-left p-3.5 rounded-xl border text-[14px] transition-all duration-200
                  ${
                    selected === null
                      ? "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:scale-[1.01]"
                      : isCorrect
                      ? "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm"
                      : isWrong
                      ? "bg-red-50 border-red-400 text-red-700 shadow-sm"
                      : "bg-slate-50 border-slate-200 opacity-60"
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
  );
}
