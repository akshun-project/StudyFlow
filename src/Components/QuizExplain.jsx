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

  // ✅ Auto Delete (Back button + Tab close + Refresh + 10 min timer)
  useEffect(() => {
    if (!user) return;

    const deleteOnExit = async () => {
      await supabase
        .from("quiz_explanations")
        .delete()
        .eq("quiz_id", quizId)
        .eq("user_id", user.id);
    };

    // ✅ Android back + Desktop browser back
    window.addEventListener("popstate", deleteOnExit);

    // ✅ Tab close + Refresh
    window.addEventListener("beforeunload", deleteOnExit);

    // ✅ Auto delete after 10 minutes
    const timer = setTimeout(() => {
      deleteOnExit();
    }, 10 * 60 * 1000);

    return () => {
      window.removeEventListener("popstate", deleteOnExit);
      window.removeEventListener("beforeunload", deleteOnExit);
      clearTimeout(timer);
    };
  }, [quizId, user]);

  // ✅ Manual Delete (Button)
  async function deleteExplanations() {
    try {
      setLoading(true);

      await supabase
        .from("quiz_explanations")
        .delete()
        .eq("quiz_id", quizId)
        .eq("user_id", user.id);

      setItems([]);
      navigate("/");
    } catch (e) {
      console.error(e);
      setError("Failed to delete explanations.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white p-5 sm:p-8 rounded-2xl shadow-xl border border-indigo-100">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
            📘 Explanations
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow text-sm sm:text-base"
            >
              ⬅ Back
            </button>

            <button
              onClick={deleteExplanations}
              className="w-full sm:w-auto px-4 py-2 bg-red-400 text-white rounded-lg shadow hover:bg-red-600 text-sm sm:text-base"
            >
              Delete & Close
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="animate-pulse bg-gray-100 h-20 rounded-xl"></div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-red-600 text-sm sm:text-base font-medium">{error}</p>
        )}

        {/* EMPTY */}
        {!loading && !error && items.length === 0 && (
          <p className="text-gray-700 text-sm sm:text-lg">
            No explanations found for this quiz.
          </p>
        )}

        {/* LIST */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-5 sm:space-y-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="p-4 sm:p-6 bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm"
              >
                <div className="text-[10px] sm:text-xs text-gray-500 mb-2">
                  {new Date(it.created_at).toLocaleString()}
                </div>

                <h3 className="font-semibold text-base sm:text-lg text-indigo-800 mb-2 sm:mb-3">
                  {it.question}
                </h3>

                <div className="mb-1">
                  <span className="font-medium text-gray-600 text-sm">Your answer: </span>
                  <span className="text-gray-900 text-sm">
                    {it.user_answer || "—"}
                  </span>
                </div>

                <div className="mb-3 sm:mb-4">
                  <span className="font-medium text-gray-600 text-sm">Correct answer: </span>
                  <span className="text-green-700 font-semibold text-sm">
                    ✅ {it.correct_answer}
                  </span>
                </div>

                <div className="p-3 sm:p-4 bg-white border rounded-lg shadow-inner text-gray-800 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {it.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
