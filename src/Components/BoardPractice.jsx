 // src/Components/BoardPractice.jsx

import React, { useState } from "react";
import { englishCase10 } from "../data/caseEnglish10";
import { biology10Test1 } from "../data/biology10_test1";
import { physics10Test1 } from "../data/physics10_test1";
import { chemistry10Test1 } from "../data/chemistry10_test1";
import { firstFlight10 } from "../data/firstFlight10";
import { footprints10 } from "../data/footprints10";
import { math10 } from "../data/math10";

// Humanities
import { history10Test1 } from "../data/history10_test1";
import { geography10Test1 } from "../data/geography10_test1";
import { politicalScience10Test1 } from "../data/political10_test1";
import { economics10Test1 } from "../data/economics10_test1";

//class12

// --- Class 12 tests ---
import { physics12Test1 } from "../data/physics12_test1";
import { chemistry12Test1 } from "../data/chemistry12_test1";
import { math12Test1 } from "../data/math12_test1";
import { biology12Test1 } from "../data/biology12_test1";
import { english12Test1 } from "../data/english12_test1";


import RealTimeQuiz from "./RealTimeQuiz";

export default function BoardPractice() {
  const [selectedClass, setSelectedClass] = useState(10); // default 10 for less friction
  const [category, setCategory] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0); // pagination for subjects

  // Unique English case study
  const getUniqueCaseStudy = () => {
    const lastId = localStorage.getItem("last_case_eng10");
    const available = englishCase10.filter((cs) => cs.id !== lastId);
    const chosen =
      available[Math.floor(Math.random() * available.length)] ||
      englishCase10[0];
    localStorage.setItem("last_case_eng10", chosen.id);
    return chosen;
  };

  // Start AI loader + pick quiz
  const startTest = () => {
    if (!category || !selectedClass) return;
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
          case "hist":
            quiz = history10Test1;
            break;
          case "geo":
            quiz = geography10Test1;
            break;
          case "pol":
            quiz = politicalScience10Test1;
            break;
          case "eco":
            quiz = economics10Test1;
            break;
          default:
            break;
        }
      }

      if (selectedClass === 12) {
  switch (category) {
    case "phy12":
      quiz = physics12Test1;
      break;
    case "chem12":
      quiz = chemistry12Test1;
      break;
    case "math12":
      quiz = math12Test1;
      break;
    case "bio12":
      quiz = biology12Test1;
      break;
    case "eng12":
      quiz = english12Test1;
      break;
    default:
      break;
  }
}


      setSelectedQuiz(quiz);
      setIsLoading(false);
    }, 9500); // keep your board-feel loader
  };

  const handleBack = () => {
    if (category) {
      setCategory(null);
      return;
    }
    // you can change this later to navigate(-1) if you use react-router
    window.location.href = "/";
  };

  // When quiz is selected, show RealTimeQuiz full-screen
  if (selectedQuiz) {
    return (
      <RealTimeQuiz
        quiz={selectedQuiz}
        onExit={() => {
          setSelectedQuiz(null);
          setCategory(null);
        }}
      />
    );
  }

  // All Class 10 subjects (Science + Humanities)
  const class10Data = [
    {
      id: "case",
      label: "English Passage",
      emoji: "📘",
      desc: "Unique case + 10 MCQs.",
      badge: "10",
    },
    {
      id: "bio",
      label: "Biology",
      emoji: "🧬",
      desc: "Life Processes, Reproduction, Heredity.",
      badge: "40",
    },
    {
      id: "phy",
      label: "Physics",
      emoji: "⚛",
      desc: "Light, Electricity, Magnetism.",
      badge: "40",
    },
    {
      id: "chem",
      label: "Chemistry",
      emoji: "🧪",
      desc: "Reactions, Metals, Carbon Compounds.",
      badge: "40",
    },
    {
      id: "math10",
      label: "Maths",
      emoji: "🧮",
      desc: "Algebra, Geometry, Trigonometry.",
      badge: "40",
    },
    {
      id: "hist",
      label: "History",
      emoji: "🏛️",
      desc: "Nationalism, Industrialisation, Print.",
      badge: "40",
    },
    {
      id: "geo",
      label: "Geography",
      emoji: "🌍",
      desc: "Resources, Agriculture, Water, Minerals.",
      badge: "40",
    },
    {
      id: "pol",
      label: "Political Science",
      emoji: "🗳️",
      desc: "Democracy, Parties, Outcomes.",
      badge: "40",
    },
    {
      id: "eco",
      label: "Economics",
      emoji: "📈",
      desc: "Development, Sectors, Money & Credit.",
      badge: "40",
    },
    {
      id: "ff",
      label: "First Flight Lit",
      emoji: "📗",
      desc: "Prose + Poems • Full book.",
      badge: "40",
    },
    {
      id: "fp",
      label: "Footprints Without Feet",
      emoji: "🐾",
      desc: "All supplementary stories.",
      badge: "40",
    },
  ];

  const class12Data = [
  {
    id: "phy12",
    label: "Physics",
    emoji: "⚛",
    desc: "40 MCQs • Electrostatics, Optics, EMI.",
    badge: "40",
  },
  {
    id: "chem12",
    label: "Chemistry",
    emoji: "🧪",
    desc: "40 MCQs • Organic, Inorganic, Physical.",
    badge: "40",
  },
  {
    id: "math12",
    label: "Maths",
    emoji: "🧮",
    desc: "40 MCQs • Calculus, Vectors, Probability.",
    badge: "40",
  },
  {
    id: "bio12",
    label: "Biology",
    emoji: "🧬",
    desc: "40 MCQs • Genetics, Evolution, Human Physiology.",
    badge: "40",
  },
  {
    id: "eng12",
    label: "English Core",
    emoji: "📘",
    desc: "40 MCQs • Flamingo + Vistas.",
    badge: "40",
  },
];

 // For bottom bar (Class 10 + Class 12)
const subjectsAll = selectedClass === 10 ? class10Data : class12Data;

const selectedSubject = subjectsAll.find((s) => s.id === category);

  const pageSize = 6;
  const pageCount =
    subjectsAll.length > 0 ? Math.ceil(subjectsAll.length / pageSize) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const startIndex = safePage * pageSize;
  const currentSubjects = subjectsAll.slice(startIndex, startIndex + pageSize);

  

  return (
    <div className="min-h-screen w-full bg-slate-50 flex justify-center">
      <div className="relative max-w-3xl w-full mx-auto px-4 pt-4 pb-24">

        {/* Header with Back */}
        <header className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95"
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <div className="text-right">
            <h1 className="text-xl font-bold text-slate-900">
              Board Practice
            </h1>
            <p className="text-[11px] text-slate-500">
              Pick class & subject. Finish a real board-style test.
            </p>
          </div>
        </header>

        {/* Step 1: Class selection */}
        <section className="mb-4">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">
            STEP 1 • SELECT CLASS
          </p>
          <div className="flex gap-2">
            {[10, 12].map((cls) => {
              const active = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    setCategory(null);
                    setPage(0);
                  }}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold border transition active:scale-95 ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Class {cls}
                </button>
              );
            })}
          </div>
         {selectedClass === 12 && (
  <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2 py-1 inline-block">
    Class 12 is live
  </p>
)}

        </section>

        {/* Step 2: Subjects with pagination */}
        {selectedClass === 10 && (
          <section className="mb-4">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              STEP 2 • CHOOSE SUBJECT TEST
            </p>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentSubjects.map((item) => {
                  const isActive = category === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={`w-full h-full flex items-start gap-3 p-3 rounded-xl border text-left transition active:scale-95 ${
                        isActive
                          ? "bg-indigo-50 border-indigo-500 shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-2xl mt-0.5">{item.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">
                            {item.label}
                          </p>
                          {item.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {item.badge} MCQs
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {pageCount > 1 && (
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                    className={`px-2 py-1 rounded-lg border ${
                      safePage === 0
                        ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    ← Previous
                  </button>
                  <span>
                    Page {safePage + 1} of {pageCount}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(pageCount - 1, p + 1))
                    }
                    disabled={safePage === pageCount - 1}
                    className={`px-2 py-1 rounded-lg border ${
                      safePage === pageCount - 1
                        ? "border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {selectedClass === 12 && (
  <>
    <p className="text-xs font-semibold text-slate-500 mb-2">
      STEP 2 • CHOOSE TEST
    </p>

    <div
      className="
        grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-4
      "
    >
      {class12Data.map((item) => {
        const isActive = category === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCategory(item.id)}
            className={`w-full h-full flex items-start gap-3 p-4 rounded-2xl border transition text-left active:scale-95 ${
              isActive
                ? "bg-indigo-50 border-indigo-500 shadow-md"
                : "border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
            }`}
          >
            <div className="text-2xl md:text-3xl shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 items-center">
                <p className="text-sm md:text-base font-semibold text-slate-900">
                  {item.label}
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                  {item.badge} MCQs
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 mt-1">
                {item.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </>
)}


        {/* Loader card */}
        {isLoading && (
          <div className="mt-6 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Generating your test…
            </h2>
            <p className="text-xs text-slate-600 mb-3">
              AI is preparing a shuffled, balanced question set for you.
            </p>

            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
              <div className="h-2 bg-indigo-600 animate-[loading_10s_linear] w-full"></div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
              <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce delay-300" />
            </div>

            <p className="text-[11px] text-slate-500">
              Optimizing difficulty, avoiding repeat questions… 
            </p>
          </div>
        )}

        {/* Sticky Start Test bar */}
        {category && !isLoading && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-white via-white/95 to-transparent border-t border-slate-200 px-4 py-3">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[11px] font-medium text-slate-700 line-clamp-1">
                  Ready for:{" "}
                  <span className="font-semibold">
                    {selectedSubject?.label ?? "Selected Test"}
                  </span>
                </p>
                <p className="text-[10px] text-slate-500">
                  {selectedSubject?.badge || "40"} MCQs • Instant checking in
                  RealTimeQuiz.
                </p>
              </div>
              <button
                onClick={startTest}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold shadow-md active:scale-95"
              >
                Start Test →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
