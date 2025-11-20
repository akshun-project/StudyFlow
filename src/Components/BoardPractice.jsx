 import React, { useState } from "react";
import { englishCase10 } from "../data/caseEnglish10";
import { biology10Test1 } from "../data/biology10_test1";
import { physics10Test1 } from "../data/physics10_test1";
import { chemistry10Test1 } from "../data/chemistry10_test1";
import { firstFlight10 } from "../data/firstFlight10";
import { footprints10 } from "../data/footprints10";
import { math10 } from "../data/math10";
import RealTimeQuiz from "./RealTimeQuiz";

export default function BoardPractice() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [category, setCategory] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Unique case study
  const getUniqueCaseStudy = () => {
    const lastId = localStorage.getItem("last_case_eng10");
    const available = englishCase10.filter((cs) => cs.id !== lastId);
    const chosen =
      available[Math.floor(Math.random() * available.length)] ||
      englishCase10[0];
    localStorage.setItem("last_case_eng10", chosen.id);
    return chosen;
  };

  // Start AI loader
  const startTest = () => {
    setIsLoading(true);

    setTimeout(() => {
      let quiz = null;

      if (selectedClass === 10) {
        switch (category) {
          case "case":
            quiz = getUniqueCaseStudy();
            break;
          case "bio":
            quiz = biology10Test1;
            break;
          case "phy":
            quiz = physics10Test1;
            break;
          case "chem":
            quiz = chemistry10Test1;
            break;
          case "ff":
            quiz = firstFlight10;
            break;
          case "fp":
            quiz = footprints10;
            break;
          case "math10":
            quiz = math10;
            break;
          default:
            break;
        }
      }

      setSelectedQuiz(quiz);
      setIsLoading(false);
    }, 9500); // 10 seconds realistic feeling
  };

  const handleBack = () => {
    if (category) return setCategory(null);
    if (selectedClass) return setSelectedClass(null);
    window.location.href = "/";
  };

  if (selectedQuiz) {
    return <RealTimeQuiz quiz={selectedQuiz} onExit={() => {
      setSelectedQuiz(null);
      setCategory(null);
      setSelectedClass(null);
    }} />;
  }

  const class10Data = [
    {
      id: "case",
      label: "English Passage",
      emoji: "📘",
      desc: "Fresh unique case study every time + 10 MCQs.",
      badge: ""
    },
    {
      id: "bio",
      label: "Biology Full Test",
      emoji: "🧬",
      desc: "40 MCQs • Life Processes, Reproduction, Heredity.",
      badge: "40"
    },
    {
      id: "phy",
      label: "Physics Full Test",
      emoji: "⚛",
      desc: "40 MCQs • Light, Electricity, Magnetism.",
      badge: "40"
    },
    {
      id: "chem",
      label: "Chemistry Full Test",
      emoji: "🧪",
      desc: "40 MCQs • Reactions, Metals, Carbon Compounds.",
      badge: "40"
    },
    {
      id: "math10",
      label: "Maths Full Test",
      emoji: "🧮",
      desc: "40 MCQs • Algebra, Geometry, Trigo.",
      badge: "40"
    },
    {
      id: "ff",
      label: "First Flight Lit",
      emoji: "📗",
      desc: "40 MCQs • Full book.",
      badge: "40"
    },
    {
      id: "fp",
      label: "Footprints Without Feet",
      emoji: "🐾",
      desc: "40 MCQs • All stories.",
      badge: "40"
    }
  ];

  return (
    <div className="relative max-w-lg mx-auto px-3 pb-24 pt-6">

      {/* Floating mobile back button */}
      <button
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 md:hidden bg-white/90 backdrop-blur border border-slate-300 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700 shadow hover:bg-slate-100 transition"
      >
        ← Back
      </button>

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur py-3 px-2 border-b border-slate-200 md:hidden">
        <h2 className="text-center text-lg font-semibold text-slate-800">
          Board Practice Arena
        </h2>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-slate-900 mt-4 text-center">
        Board Practice
      </h1>
      <p className="text-center text-slate-600 text-sm mb-6">
        AI-powered mock tests specially crafted for real board experience.
      </p>

      {/* Step 1 */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 mb-2">
          STEP 1 • SELECT CLASS
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[10, 12].map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setCategory(null);
              }}
              className={`p-4 rounded-xl border transition ${
                selectedClass === cls
                  ? "border-indigo-500 bg-indigo-50 shadow"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">
                Class {cls}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {cls === 10
                  ? "Boards coming soon – start practicing."
                  : "Science stream (coming soon)."}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      {selectedClass === 10 && (
        <>
          <p className="text-xs font-semibold text-slate-500 mb-2">
            STEP 2 • CHOOSE TEST
          </p>

          <div className="space-y-3">
            {class10Data.map((item) => (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border transition text-left ${
                  category === item.id
                    ? "bg-indigo-50 border-indigo-500 shadow"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="text-2xl">{item.emoji}</div>
                <div>
                  <div className="flex gap-2 items-center">
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                      {item.badge} MCQs
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 3 */}
      {category && !isLoading && (
        <button
          onClick={startTest}
          className="w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
        >
          Start Test
        </button>
      )}

      {/* AI Loader */}
      {isLoading && (
        <div className="mt-8 p-6 bg-white border border-slate-200 rounded-2xl shadow text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Generating your test…
          </h2>
          <p className="text-slate-600 text-sm mb-4">
            AI is preparing a unique question set just for you.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-4">
            <div className="h-2 bg-indigo-600 animate-[loading_10s_linear] w-full"></div>
          </div>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-300"></div>
          </div>

          <p className="text-xs text-slate-500 mt-3">Optimizing difficulty...</p>
        </div>
      )}
    </div>
  );
}
