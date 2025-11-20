import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added

export default function QuizSetup({
  classData,
  studentClass,
  setStudentClass,
  subjects,
  setSubjects,
  chapters,
  setChapters,
  loading,
  onGenerate,
  onCancel,
}) {
  const navigate = useNavigate(); // ✅ Added
  const [motivationStep, setMotivationStep] = useState(true);
  const [showMessage, setShowMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleGenerateClick = () => {
    if (!studentClass) {
      setErrorMessage("Please select your class first.");
      return;
    }
    if (subjects.length === 0) {
      setErrorMessage("Please choose at least one subject.");
      return;
    }
    for (const s of subjects) {
      if (!chapters[s]) {
        setErrorMessage(`Please select a chapter for ${s}.`);
        return;
      }
    }
    setErrorMessage("");
    onGenerate();
  };

  const handleReady = () => {
    setShowMessage("Awesome! Let’s begin your quiz journey 🚀");
    setTimeout(() => {
      setMotivationStep(false);
      setShowMessage("");
    }, 1100);
  };

  const handleNotYet = () => {
    setShowMessage("No problem! Let’s still take a quick quiz 💪");
    setTimeout(() => {
      setMotivationStep(false);
      setShowMessage("");
    }, 1500);
  };

  // ------------------ STEP 1: Motivation screen ------------------
  if (motivationStep) {
    return (
      <div className="p-6 text-center transition-all duration-500">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          🌟 Did you complete your today’s plan?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Consistency builds mastery! Whether or not you finished your plan, a
          quick quiz can refresh your knowledge.
        </p>

        {!showMessage ? (
          <div className="flex justify-center gap-3">
            <button
              onClick={handleReady}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:scale-[1.03] transition-all shadow"
            >
              ✅ Yes, I’m ready!
            </button>
            <button
              onClick={handleNotYet}
              className="px-6 py-3 text-gray-700 border rounded-lg hover:bg-gray-50 transition-all"
            >
              ❌ Not yet
            </button>
          </div>
        ) : (
          <div className="text-center mt-4">
            <p className="text-indigo-600 font-medium animate-fade-in">
              {showMessage}
            </p>
          </div>
        )}

        <p className="text-sm text-gray-400 mt-6">
          “Progress is progress — even one quiz counts.” 💪
        </p>
      </div>
    );
  }

  // ------------------ STEP 2: Quiz setup form ------------------
  return (
    <div className="p-6 transition-all duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
          ✨ Let’s Personalize Your AI Quiz
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your AI mentor will craft smart, personalized questions based on your
          class and favorite chapters.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 text-sm mb-4">
          {errorMessage}
        </div>
      )}

      {/* Class Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Select Class
        </label>
        <select
          value={studentClass}
          onChange={(e) => {
            setStudentClass(e.target.value);
            setSubjects([]);
            setChapters({});
          }}
          className="w-full border rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Choose your class</option>
          {Object.keys(classData).map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Selection */}
      {studentClass && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Select Subjects <span className="text-gray-400">(limit 3)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {classData[studentClass].subjects.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSubject(s)}
                className={`px-4 py-3 rounded-full text-sm transition-all duration-200 border
                  ${
                    subjects.includes(s)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                      : "bg-white hover:bg-gray-50 text-gray-800 border-gray-200"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Selection */}
      {subjects.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-700">
            Choose one chapter per subject
          </label>
          <div className="space-y-4">
            {subjects.map((s) => (
              <div key={s}>
                <p className="font-semibold mb-1 text-gray-800">{s}</p>
                <select
                  value={chapters[s] || ""}
                  onChange={(e) => handleChapterChange(s, e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Chapter</option>
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

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-2 mt-8">
        <div className="flex justify-center gap-3">
          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className={`relative px-6 py-3 rounded-lg font-medium text-white transition-all duration-300
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]"
              }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
                <span>AI is preparing your quiz…</span>
              </div>
            ) : (
              "Generate AI Quiz 🚀"
            )}
          </button>

          <button
            onClick={() => setMotivationStep(true)}
            className="px-6 py-3 text-gray-700 border rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="text-sm text-indigo-500 hover:underline mt-2 transition-opacity duration-500 opacity-80 hover:opacity-100"
        >
          🏠 Back to Home
        </button>
      </div>

      <p className="text-center mt-6 text-sm text-gray-500">
        💡 “Every quiz you take trains your brain like a muscle.”
      </p>
    </div>
  );
}
