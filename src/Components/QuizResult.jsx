 // src/Components/QuizResult.jsx
import React from "react";

export default function QuizResult({
  score,
  total,
  saving,
  error,
  onRetry,
  onExplain,
  onBackHome,
  loading,
  timeSeconds = 0, // ✅ Added timer
  coinsAdded = true, // Optional prop (true after +5 added)
}) {
  const percentage = Math.round((score / total) * 100);

  const getFeedback = () => {
    if (percentage === 100) return "🌟 Perfect! You’ve mastered it!";
    if (percentage >= 80) return "💪 Excellent work! You’re nearly unstoppable.";
    if (percentage >= 60)
      return "✨ Great effort! A bit more practice and you’ll ace it.";
    if (percentage >= 40)
      return "📘 Keep going — every attempt builds confidence.";
    return "🌱 Don’t worry, learning starts here. You’ve taken the most important step!";
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-500 border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        🎉 Quiz Completed!
      </h2>

      {/* Score Circle */}
      <div className="relative inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 mt-2 mb-6">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="45" stroke="#E5E7EB" strokeWidth="10" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#grad)"
            strokeWidth="10"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * percentage) / 100}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-xl sm:text-2xl font-semibold text-indigo-700 z-10">
          {percentage}%
        </span>
      </div>

      {/* Score + Time */}
      <p className="text-gray-700 mb-1">
        You scored <span className="font-semibold">{score}</span> / {total}
      </p>
      <p className="text-gray-500 text-sm mb-3">
        ⏱ Time Taken: <span className="font-medium">{formatTime(timeSeconds)}</span>
      </p>

      {/* Feedback text */}
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">{getFeedback()}</p>

      {/* Save + Coins */}
      {saving ? (
        <p className="text-indigo-500 text-sm animate-pulse mb-2">
          Saving your result...
        </p>
      ) : (
        <p className="text-green-600 text-sm font-medium mb-3">
          ✅ Saved to your dashboard
        </p>
      )}

      {coinsAdded && (
        <p className="text-amber-600 text-xs font-medium mb-3">
          🪙 +5 coins added for completing your quiz!
        </p>
      )}

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <button
          onClick={onRetry}
          disabled={loading}
          className={`px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all text-sm ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          Take Another Quiz
        </button>

        <button
          onClick={onExplain}
          disabled={loading}
          className={`px-5 py-2.5 bg-yellow-500 text-white rounded-lg font-medium hover:brightness-105 transition-all text-sm ${
            loading ? "opacity-60 cursor-wait" : ""
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            "Unlock Explanations (10 coins)"
          )}
        </button>

        <button
          onClick={onBackHome}
          disabled={loading}
          className="px-5 py-2.5 border text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-5 italic">
        ⚠ Unlocking explanations will deduct 10 coins.
      </p>

      <p className="text-xs text-gray-400 mt-3">
        💡 “Learning isn’t about being perfect — it’s about progress.”
      </p>
    </div>
  );
}
