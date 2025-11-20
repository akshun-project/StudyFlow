// src/Components/BoardTestResult.jsx
import React from "react";

export default function BoardTestResult({
  score,
  total,
  timeSeconds,
  onBack,
  onHome,
}) {
  const percentage = Math.round((score / total) * 100);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getFeedback = () => {
    if (percentage === 100) return "🌟 Outstanding! Board level mastery!";
    if (percentage >= 90) return "🔥 Brilliant! You’re exam-ready!";
    if (percentage >= 75) return "💪 Great performance! Keep polishing.";
    if (percentage >= 50) return "✨ Good try — continue practicing for perfection.";
    return "📘 Don’t worry. Review concepts & try again — progress begins here!";
  };

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-10">
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-7 text-center animate-fadeIn">

        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          🎉 Test Completed!
        </h2>

        {/* Score Circle */}
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              stroke="#E5E7EB" strokeWidth="10" fill="none"
            />
            <circle
              cx="50" cy="50" r="45"
              stroke="url(#grad)"
              strokeWidth="10"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * percentage) / 100}
              strokeLinecap="round"
              style={{ transition: "1s ease" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-2xl font-semibold text-indigo-700">
            {percentage}%
          </span>
        </div>

        {/* Score + Time */}
        <p className="text-slate-700 mb-1">
          Score: <span className="font-semibold">{score}</span> / {total}
        </p>
        <p className="text-slate-500 text-sm mb-4">
          ⏱ Time Taken: <span className="font-medium">{formatTime(timeSeconds)}</span>
        </p>

        {/* Feedback */}
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {getFeedback()}
        </p>

        {/* Saved message */}
        <p className="text-green-600 text-sm font-medium mb-4">
          ✔ Your result has been saved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
          >
            Take Another Test
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
          >
            ← Back to Home
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-6 italic">
          “Every test you take sharpens your confidence.”
        </p>
      </div>
    </div>
  );
}
