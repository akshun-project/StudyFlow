 // src/components/QuizExplain.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";
import { useUser } from "@clerk/clerk-react";

export default function QuizExplain() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (!user) {
          setError("Please log in to view explanations.");
          return;
        }

        const { data, error } = await supabase
          .from("quiz_explanations")
          .select("*")
          .eq("quiz_id", quizId)
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (mounted) setItems(data || []);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Could not load explanations.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [quizId, user]);

  // ✅ Auto Delete (Exit & Timeout)
  useEffect(() => {
    if (!user) return;

    const deleteOnExit = async () => {
      await supabase
        .from("quiz_explanations")
        .delete()
        .eq("quiz_id", quizId)
        .eq("user_id", user.id);
    };

    window.addEventListener("popstate", deleteOnExit);
    window.addEventListener("beforeunload", deleteOnExit);
    const timer = setTimeout(deleteOnExit, 10 * 60 * 1000);

    return () => {
      window.removeEventListener("popstate", deleteOnExit);
      window.removeEventListener("beforeunload", deleteOnExit);
      clearTimeout(timer);
    };
  }, [quizId, user]);

 async function deleteExplanations() {
  try {
    setLoading(true);

    // Delete the explanations for this quiz
    await supabase
      .from("quiz_explanations")
      .delete()
      .eq("quiz_id", quizId)
      .eq("user_id", user.id);
 
    setItems([]);
 
    setTimeout(() => {
      navigate("/"); // ✅ Goes to home page
    }, 500);  
  } catch (e) {
    console.error(e);
    setError("Failed to delete explanations.");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-purple-50 p-5 sm:p-8 transition-all duration-500">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-lg p-6 sm:p-10 rounded-3xl shadow-xl border border-indigo-100 transition-all duration-300">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 mb-1">
              🧠 Learn from Your Quiz
            </h2>
            <p className="text-sm text-gray-500">
              Your AI mentor has reviewed your answers. Here’s what you can improve:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              ← Back
            </button>
            <button
              onClick={deleteExplanations}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:scale-[1.02] transition-all text-sm sm:text-base"
            >
              Finish Review
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="animate-pulse bg-indigo-100/50 h-24 rounded-2xl"
              ></div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-red-600 text-center text-sm sm:text-base font-medium">
            {error}
          </p>
        )}

        {/* EMPTY */}
        {!loading && !error && items.length === 0 && (
          <p className="text-gray-700 text-center text-sm sm:text-lg">
            No explanations found for this quiz.
          </p>
        )}

        {/* LIST */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-6">
            {items.map((it, index) => (
             <div
  key={it.id}
  className="p-5 sm:p-6 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
>
  <div className="flex justify-between items-center mb-2">
    <span className="text-[11px] sm:text-xs text-gray-500">
      {new Date(it.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
    <span className="text-[11px] text-indigo-500 font-medium">
      🤖 AI Mentor
    </span>
  </div>

  <h3 className="font-semibold text-base sm:text-lg text-indigo-800 mb-3 leading-snug">
    {it.question}
  </h3>

  <div className="mb-1 text-sm sm:text-base">
    <span className="font-medium text-gray-600">Your answer: </span>
    <span
      className={`${
        it.user_answer === it.correct_answer
          ? "text-green-700 font-semibold"
          : "text-red-600 font-medium"
      }`}
    >
      {it.user_answer || "—"}
    </span>
  </div>

  <div className="mb-3 text-sm sm:text-base">
    <span className="font-medium text-gray-600">Correct answer: </span>
    <span className="text-green-700 font-semibold">
      ✅ {it.correct_answer}
    </span>
  </div>

  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 sm:p-5 shadow-inner text-gray-800 leading-relaxed whitespace-pre-line text-sm sm:text-base">
    <p className="font-medium text-indigo-700 mb-1">Explanation:</p>
    {it.explanation ? (
      <p className="text-gray-700 whitespace-pre-line">{it.explanation}</p>
    ) : (
      <p className="text-gray-400 italic">Generating explanation...</p>
    )}
  </div>
</div>
 
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
