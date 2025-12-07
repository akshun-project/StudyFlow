import React from "react";

 

export default function QuizPlay({
  quiz,
  currentIndex,
  score,
  selectedOption,
  handleChoose,
  loading,
  timerSeconds,
  onBackHome,
}) {
  const currentQuestion = quiz[currentIndex];

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative bg-white shadow-xl rounded-2xl p-8 max-w-3xl mx-auto transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600 text-sm">
          Question {currentIndex + 1} / {quiz.length}
        </div>
        <div className="text-indigo-600 text-sm font-semibold">
          Score: {score}
        </div>
      </div>

      {/* Timer */}
      <div className="absolute top-4 right-6 text-xs text-gray-400">
        ⏱ {formatTime(timerSeconds)}
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold mb-5 text-gray-900 leading-relaxed">
        {currentQuestion?.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {currentQuestion?.options?.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedOption === opt;
          const correctLetter = (currentQuestion.answer || "").toUpperCase();
          const correctIdx = /^[A-D]$/.test(correctLetter)
            ? correctLetter.charCodeAt(0) - 65
            : -1;
          const correctOpt =
            correctIdx >= 0 ? currentQuestion.options[correctIdx] : null;

          let style =
            "bg-white hover:bg-indigo-50 border transition-all duration-200";
          if (selectedOption) {
            if (isSelected) {
              style =
                opt === correctOpt
                  ? "bg-green-100 border-green-400 text-green-800"
                  : "bg-red-100 border-red-400 text-red-800";
            } else if (opt === correctOpt) {
              style = "bg-green-50 border-green-200 text-green-700";
            }
          }

          return (
            <button
              key={idx}
              disabled={!!selectedOption || loading}
              onClick={() => handleChoose(opt)}
              className={`text-left p-4 rounded-xl border ${style} focus:outline-none active:scale-[0.99]`}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-indigo-700">{letter}.</span>
                <span>{opt.replace(/^[A-D][\).]\s*/i, "").trim()}</span>

              </div>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / quiz.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Encouragement text */}
      <p className="text-sm text-center text-gray-500 mt-4">
        💡 “Every question helps you grow a little smarter.”
      </p>

      {/* Navigation */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onBackHome}
          className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 text-sm"
        >
          ← Back Home
        </button>
      </div>
    </div>
  );
}
