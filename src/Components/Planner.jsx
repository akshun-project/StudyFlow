 import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import client from "../geminiClient/gemini";
import { supabase } from "../Supabase/supabaseClient";
import classData from "./classData"; // ✅ Centralized dataset

export default function Planner() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [studentClass, setStudentClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState({});
  const [totalTime, setTotalTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  const messages = [
    "Analyzing your selected subjects...",
    "Designing a balanced study routine...",
    "Optimizing focus sessions and breaks...",
    "Finalizing your personalized plan...",
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleDurationChange = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) return setTotalTime("");
    value = Math.round(value * 2) / 2;
    if (value < 0.5) value = 0.5;
    if (value > 8) value = 8;
    setTotalTime(value);
  };

  const handleSubjectChange = (subject) => {
    if (subjects.includes(subject)) {
      const updated = subjects.filter((s) => s !== subject);
      const newChapters = { ...chapters };
      delete newChapters[subject];
      setSubjects(updated);
      setChapters(newChapters);
    } else if (subjects.length < 3) {
      setSubjects([...subjects, subject]);
    }
  };

  const handleChapterChange = (subject, chapter) => {
    setChapters({ ...chapters, [subject]: chapter });
  };

  // ✅ Generate & Save Study Plan
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentClass || subjects.length === 0 || !totalTime) {
      alert("Looks like a few details are missing — please check again.");
      return;
    }

    for (const subject of subjects) {
      if (!chapters[subject] || chapters[subject].trim() === "") {
        alert(`Please select a chapter for ${subject}`);
        return;
      }
    }

    setLoading(true);
    setPlan("");
    setError("");

    try {
      const prompt = `
You are StudyFlow — an expert CBSE planner for students.
Generate a personalized daily study plan ONLY in valid JSON format.

Details:
- Class: ${studentClass}
- Subjects: ${subjects.join(", ")}
- Chapters: ${subjects
        .map((s) => `${s}: ${chapters[s] || "all chapters"}`)
        .join(", ")}
- Total Study Time: ${totalTime} hours
- Start Time: ${startTime || "9:00 AM"}

Guidelines:
- Divide time evenly across subjects.
- Each session lasts 30–60 minutes.
- Include 5–10 minute breaks.
- Keep tone motivating, output short.
- JSON only.

Example JSON:
{
  "plan": [
    { "time": "9:00 AM - 9:45 AM", "subject": "Math", "chapter": "Polynomials", "activity": "Understand formulas" }
  ],
  "note": "Stay consistent and revise small topics daily."
}`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      let text =
        response.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        response?.text ||
        "";
      text = text.replace(/```json|```/g, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        setError("We couldn’t format your plan properly. Please try again.");
        return;
      }

      if (!parsed.plan || !Array.isArray(parsed.plan)) {
        setError("Invalid response from AI. Try again later.");
        return;
      }

      setPlan(parsed);

      if (user) {
        await supabase.from("planner_data").insert([
          {
            user_id: user.id,
            class: studentClass,
            subjects,
            chapters,
            total_time: totalTime,
            schedule: JSON.stringify(parsed.plan),
            created_at: new Date(),
          },
        ]);
      }

      setTimeout(() => {
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 8000);
      }, 800);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Something went wrong while generating your plan. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-indigo-50 to-purple-50 flex flex-col items-center py-10 px-4 transition-all duration-500">
      <h1 className="text-3xl font-bold text-indigo-700 mb-1 text-center">
        📘 Smart Study Planner
      </h1>
      <p className="text-gray-500 text-sm mb-8 text-center">
        Your AI mentor will craft a personalized, effective study plan.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-indigo-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all flex flex-col gap-6"
      >
        {/* Class Selection */}
        <div>
          <label className="font-medium text-gray-700 mb-2 block">
            Select Class
          </label>
          <select
            className="border border-gray-300 focus:border-indigo-500 outline-none p-2.5 rounded-lg w-full"
            value={studentClass}
            onChange={(e) => {
              setStudentClass(e.target.value);
              setSubjects([]);
              setChapters({});
            }}
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
          <div>
            <label className="font-medium text-gray-700 mb-2 block">
              Select up to 3 Subjects
            </label>
            <div className="flex flex-wrap gap-2">
              {classData[studentClass].subjects.map((subject) => (
                <button
                  type="button"
                  key={subject}
                  onClick={() => handleSubjectChange(subject)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 ${
                    subjects.includes(subject)
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                      : "bg-white hover:bg-indigo-50 text-gray-800 border-gray-200"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Selection */}
        {subjects.map((subject) => (
          <div key={subject}>
            <label className="font-semibold text-gray-700">
              {subject} Chapter
            </label>
            <select
              className="border border-gray-300 focus:border-indigo-500 outline-none p-2.5 rounded-lg w-full mt-1"
              value={chapters[subject] || ""}
              onChange={(e) => handleChapterChange(subject, e.target.value)}
            >
              <option value="">Select Chapter</option>
              {classData[studentClass].chapters[subject].map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Time Inputs */}
        {subjects.length > 0 && (
          <>
            <div>
              <label className="font-medium text-gray-700 mb-2 block">
                Total Study Time (max 8 hrs)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={totalTime}
                onChange={handleDurationChange}
                placeholder="Enter total hours"
                className="border border-gray-300 focus:border-indigo-500 outline-none p-2.5 rounded-lg w-full"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 mb-2 block">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 focus:border-indigo-500 outline-none p-2.5 rounded-lg w-full"
              />
            </div>
          </>
        )}

        <div className="flex flex-col items-center gap-2 mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white transition-all duration-300 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {loading ? "AI is preparing your plan..." : "Generate Study Plan 🚀"}
          </button>

          <button
            onClick={() => navigate("/")}
            type="button"
            className="text-sm text-indigo-500 hover:underline mt-2"
          >
            🏠 Back to Home
          </button>
        </div>
      </form>

      {/* Loading UI */}
      {loading && (
        <div className="mt-10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-12 w-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-indigo-700 font-medium">{messages[loadingStep]}</p>
          <p className="text-gray-500 text-sm">
            This usually takes just a few seconds...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-6 text-red-600 font-medium bg-red-50 border border-red-100 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Saved Confirmation */}
      {showSaved && (
        <div className="mt-8 bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <p className="font-medium">
            ✅ Your study plan has been saved successfully!
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium text-green-700 hover:underline"
          >
            View Dashboard →
          </button>
        </div>
      )}

      {/* Generated Plan */}
      {plan && plan.plan && (
        <div className="animate-fadeIn mt-10 bg-white/95 backdrop-blur-xl border border-indigo-100 p-6 rounded-3xl shadow-xl w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
            🎯 Your Study Plan is Ready!
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            Here’s your personalized schedule crafted by StudyFlow AI.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-indigo-50/60 text-gray-700">
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Chapter</th>
                  <th className="p-3 border">Activity</th>
                </tr>
              </thead>
              <tbody>
                {plan.plan.map((p, idx) => (
                  <tr
                    key={idx}
                    className="odd:bg-white even:bg-indigo-50/20 hover:bg-indigo-50 transition-all"
                  >
                    <td className="p-3 border text-gray-800">{p.time}</td>
                    <td className="p-3 border text-indigo-700 font-medium">
                      {p.subject}
                    </td>
                    <td className="p-3 border text-gray-700">{p.chapter}</td>
                    <td className="p-3 border text-gray-700">{p.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-gray-600 text-sm text-center italic">
            💡 {plan.note}
          </p>
        </div>
      )}
    </div>
  );
}
