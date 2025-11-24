 import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/clerk-react";

export default function Features() {
  const { isSignedIn } = useUser();

  // Feature list
  const features = [
    {
      emoji: "📝",
      title: "Daily Study Planner",
      desc: "Create chapter-wise schedules for up to 3 subjects using smart AI planning.",
      link: "/planner",
      btn: "Start Planning →",
    },
    {
      emoji: "⚡",
      title: "Smart AI Quizzes",
      desc: "Take instant chapterwise AI quizzes, unlock explanations using coins, and track accuracy.",
      link: "/quiz",
      btn: "Take Quiz →",
    },
    {
      emoji: "🎯",
      title: "Board Practice Zone",
      desc: "English passage, PYQs quiz, full-book tests — everything for board preparation in one place.",
      link: "/board-practice",
      btn: "Start Practice →",
    },
    {
      emoji: "🧩",
      title: "Performance Dashboard",
      desc: "Your coins, streak, quizzes, plans & analytics — all in one place.",
      link: "/dashboard",
      btn: "Open Dashboard →",
    },
  ];

  return (
    <div id="features" className="min-h-screen bg-gradient-to-b from-white to-indigo-50 py-16 px-6">

      {/* Page Title */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Explore StudyFlow Tools
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
          Your all-in-one place for planning, quizzes, board prep and tracking your full progress.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
        {features.map((f, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{f.emoji}</span>
              <h2 className="text-xl font-semibold text-gray-900">{f.title}</h2>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{f.desc}</p>

            {/* Buttons */}
            {isSignedIn ? (
              <Link to={f.link}>
                <button className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
                  {f.btn}
                </button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full py-3 rounded-lg bg-gray-300 text-gray-700 font-medium cursor-pointer hover:bg-gray-400 transition">
                  Login to access →
                </button>
              </SignInButton>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}