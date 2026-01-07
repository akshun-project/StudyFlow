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
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const getBand = () => {
    if (percentage >= 85)
      return {
        title: "Top Performance Band",
        color: "bg-green-50 border-green-300 text-green-800",
        remark:
          "Your preparation aligns with board toppers. Maintain consistency.",
      };
    if (percentage >= 65)
      return {
        title: "Above Average Band",
        color: "bg-blue-50 border-blue-300 text-blue-800",
        remark:
          "Good board readiness. Improve accuracy for higher scores.",
      };
    if (percentage >= 45)
      return {
        title: "Average Band",
        color: "bg-yellow-50 border-yellow-300 text-yellow-800",
        remark:
          "Concepts are forming. Regular practice will boost performance.",
      };
    return {
      title: "Foundation Band",
      color: "bg-red-50 border-red-300 text-red-800",
      remark:
        "Strong concept revision required before full-length tests.",
    };
  };

  const band = getBand();

  const speedLevel =
    timeSeconds < total * 30
      ? "Fast"
      : timeSeconds < total * 45
      ? "Moderate"
      : "Slow";

  const accuracyLevel =
    percentage >= 75 ? "High" : percentage >= 50 ? "Medium" : "Low";

  return (
    <div className="max-w-3xl mx-auto px-4 pt-16 pb-12">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Board Practice Result
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2" />
          <p className="text-sm text-slate-500 mt-3">
            Performance analysis based on board exam standards
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid gap-5 sm:grid-cols-3 mb-8">

          {/* Score */}
          <div className="rounded-2xl border p-5 text-center bg-indigo-50/50">
            <p className="text-sm text-slate-500 mb-1">Overall Score</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
              {percentage}%
            </p>
            <p className="text-sm text-slate-600">
              {score} / {total} marks
            </p>
          </div>

          {/* Time */}
          <div className="rounded-2xl border p-5 text-center bg-sky-50/60">
            <p className="text-sm text-slate-500 mb-1">Time Taken</p>
            <p className="text-3xl font-semibold text-slate-800">
              {formatTime(timeSeconds)}
            </p>
            <p className="text-xs text-slate-500">
              Speed & time management
            </p>
          </div>

          {/* Band */}
          <div
            className={`rounded-2xl border p-5 ${band.color}`}
          >
            <p className="text-sm font-semibold">{band.title}</p>
            <p className="text-sm mt-2 leading-relaxed">
              {band.remark}
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Performance Insights
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <Insight
              title="Accuracy Level"
              value={accuracyLevel}
              color="border-indigo-400"
              hint="Correct answer ratio"
            />
            <Insight
              title="Speed Efficiency"
              value={speedLevel}
              color="border-sky-400"
              hint="Time per question"
            />
            <Insight
              title="Conceptual Strength"
              value={
                percentage >= 60 ? "Satisfactory" : "Needs Improvement"
              }
              color="border-amber-400"
              hint="Concept clarity assessment"
            />
            <Insight
              title="Exam Readiness"
              value={percentage >= 75 ? "Nearly Ready" : "Not Ready Yet"}
              color="border-rose-400"
              hint="Exam preparedness"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90"
          >
            Practice Another Test
          </button>

          <button
            onClick={onHome}
            className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
          >
            Back to Home 
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center mt-8 italic">
          Improvement comes from understanding, not just attempting.
        </p>
      </div>
    </div>
  );
}

/* ---------- Insight Card ---------- */
function Insight({ title, value, hint, color }) {
  return (
    <div className={`rounded-xl border-l-4 ${color} border p-4 bg-white`}>
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-lg font-semibold text-slate-900 mt-1">
        {value}
      </p>
      <p className="text-xs text-slate-400 mt-1">{hint}</p>
    </div>
  );
}
