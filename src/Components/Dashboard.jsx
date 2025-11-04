// src/Components/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../Supabase/supabaseClient";

import {
  BarChart3,
  BookOpen,
  ClipboardList,
  User,
  LogOut,
  Trophy,
} from "lucide-react";


const DEFAULT_TOTAL_QUESTIONS = 8;  

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  const [quizData, setQuizData] = useState([]);
  const [plannerData, setPlannerData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0); // coin balance
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: "overview", icon: <BarChart3 size={22} />, label: "Overview" },
    { id: "planner", icon: <ClipboardList size={22} />, label: "Planner" },
    { id: "quiz", icon: <BookOpen size={22} />, label: "Quiz" },
    { id: "achievements", icon: <Trophy size={22} />, label: "Achievements" },
    { id: "profile", icon: <User size={22} />, label: "Profile" },
  ];

  // --------------------------
  // Coins helpers (supabase "coins" table expected: user_id, balance)
  // --------------------------
  const fetchCoins = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("coins")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.warn("coins fetch error:", error);
        return 0;
      }

      if (!data) {
        // create a row for first-time user
        await supabase.from("coins").insert({ user_id: userId, balance: 0 });
        return 0;
      }

      return data.balance ?? 0;
    } catch (err) {
      console.error("fetchCoins error:", err);
      return 0;
    }
  };

  const setCoinsInDb = async (userId, newBalance) => {
    try {
      // upsert-like behavior: try update first, else insert
      const { error: updErr } = await supabase
        .from("coins")
        .update({ balance: newBalance })
        .eq("user_id", userId);

      if (updErr) {
        // maybe row doesn't exist, insert
        await supabase
          .from("coins")
          .insert({ user_id: userId, balance: newBalance });
      }
      setCoins(newBalance);
      return newBalance;
    } catch (err) {
      console.error("setCoinsInDb error:", err);
      return null;
    }
  };

  // Add coins (positive amount) — returns new balance or null on error
  const addCoins = async (amount = 1) => {
    if (!user) return null;
    try {
      const current = await fetchCoins(user.id);
      const newBalance = (current || 0) + Number(amount || 0);
      return await setCoinsInDb(user.id, newBalance);
    } catch (err) {
      console.error("addCoins error:", err);
      return null;
    }
  };

  // Spend coins (deduct if enough balance). Returns new balance or false if insufficient.
  const spendCoins = async (amount = 0) => {
    if (!user) return false;
    try {
      const current = await fetchCoins(user.id);
      const amt = Number(amount || 0);
      if ((current || 0) < amt) return false;
      const newBalance = current - amt;
      await setCoinsInDb(user.id, newBalance);
      return newBalance;
    } catch (err) {
      console.error("spendCoins error:", err);
      return false;
    }
  };

  // --------------------------
  // fetch function (reusable)
  // --------------------------
  const loadDashboardData = useCallback(
    async (
      opts = {
        fetchPlanner: true,
        fetchQuiz: true,
        fetchStreak: true,
        fetchCoins: true,
      }
    ) => {
      if (!user) return;
      setLoading(true);

      try {
        if (opts.fetchPlanner) {
          const { data: plans, error: pErr } = await supabase
            .from("planner_data")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (pErr) console.warn("planner_data fetch error:", pErr);
          setPlannerData(plans || []);
        }

        if (opts.fetchQuiz) {
          const { data: quiz, error: qErr } = await supabase
            .from("quiz_data")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (qErr) console.warn("quiz_data fetch error:", qErr);
          setQuizData(quiz || []);
        }

        if (opts.fetchStreak) {
          const { data: streakRow, error: sErr } = await supabase
            .from("streaks")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle(); // maybeSingle avoids 406 when no rows
          if (sErr) console.warn("streaks fetch error:", sErr);
          if (streakRow) {
            setStreak(streakRow.current_streak ?? 0);
          } else {
            setStreak(0);
          }
        }

        if (opts.fetchCoins) {
          const b = await fetchCoins(user.id);
          setCoins(b || 0);
        }
      } catch (err) {
        console.error("loadDashboardData error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // On mount & when user changes: initial load
  useEffect(() => {
    if (!user) return;
    loadDashboardData();

    // update streak (daily-open based) immediately after load (so user opening app counts)
    (async function updateStreakOnOpen() {
      try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split("T")[0];

        // fetch single streak row for user
        const { data: row, error } = await supabase
          .from("streaks")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.warn("streak fetch error:", error);
        }

        if (!row) {
          // create first streak record
          const { error: insertErr } = await supabase.from("streaks").insert({
            user_id: user.id,
            last_active: today,
            current_streak: 1,
          });
          if (insertErr) console.warn("streak insert error:", insertErr);
          setStreak(1);
        } else {
          const lastActive = row.last_active
            ? row.last_active.split("T")[0]
            : row.last_active;
          if (lastActive === today) {
            // already counted today
            setStreak(row.current_streak ?? 0);
          } else {
            // only increment if last_active is yesterday; else reset to 1
            const newCount =
              lastActive === yesterday ? (row.current_streak ?? 0) + 1 : 1;
            const { error: updErr } = await supabase
              .from("streaks")
              .update({ current_streak: newCount, last_active: today })
              .eq("user_id", user.id);
            if (updErr) console.warn("streak update error:", updErr);
            setStreak(newCount);
          }
        }
      } catch (err) {
        console.error("updateStreakOnOpen error:", err);
      }
    })();
  }, [user, loadDashboardData]);

  // Real-time subscriptions for quiz_data and planner_data (keeps dashboard live)
  useEffect(() => {
    if (!user) return;

    // subscribe to inserts/updates/deletes for quiz_data for this user
    const quizChannel = supabase
      .channel(`public:quiz_data:user_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "quiz_data",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // when quiz_data changes, reload quiz data (or we could update incrementally)
          loadDashboardData({
            fetchPlanner: false,
            fetchQuiz: true,
            fetchStreak: false,
            fetchCoins: false,
          });
        }
      )
      .subscribe();

    // planner_data realtime
    const plannerChannel = supabase
      .channel(`public:planner_data:user_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "planner_data",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadDashboardData({
            fetchPlanner: true,
            fetchQuiz: false,
            fetchStreak: false,
            fetchCoins: false,
          });
        }
      )
      .subscribe();

    // streaks realtime update
    const streakChannel = supabase
      .channel(`public:streaks:user_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "streaks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newRow = payload.new;
          if (newRow?.current_streak != null) setStreak(newRow.current_streak);
        }
      )
      .subscribe();

    return () => {
      // cleanup subscriptions
      supabase.removeChannel(quizChannel);
      supabase.removeChannel(plannerChannel);
      supabase.removeChannel(streakChannel);
    };
  }, [user, loadDashboardData]);

  useEffect(() => {
    if (!user) return;

    const coinsChannel = supabase
      .channel(`public:coins:user_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "coins",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload?.new?.balance != null) setCoins(payload.new.balance);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coinsChannel);
    };
  }, [user]);

  if (!user) {
    return <div className="p-6">Please log in to view your dashboard.</div>;
  }

  if (loading) return <p className="p-6">Loading...</p>;

  // Accuracy calculation:
  const accuracy =
    quizData.length > 0
      ? Math.round(
          quizData.reduce((sum, q) => {
            const totalQs =
              Number(q.total_questions) || DEFAULT_TOTAL_QUESTIONS;
            const correct = Number(q.score) || 0;

            // calculate percent for this quiz
            const percent =
              totalQs === 0
                ? 0
                : Math.min(100, Math.round((correct / totalQs) * 100));

            return sum + percent;
          }, 0) / quizData.length
        )
      : 0;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">
            StudyFlow Dashboard
          </h1>
        </div>

        <nav className="flex flex-col flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-3 p-4 border-t text-red-600 hover:bg-red-50">
          <LogOut size={22} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "overview" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-gray-500 text-sm">Your Coins</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  🪙 {coins}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-gray-500 text-sm">Study Streak</h3>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  🔥 {streak}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-gray-500 text-sm">Plans Created</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {plannerData.length}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-gray-500 text-sm">Quiz Accuracy</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {accuracy}%
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "planner" && (
          <section className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">
              Your Study Plans
            </h2>

            {plannerData.length === 0 ? (
              <p className="text-gray-600">No study plans found.</p>
            ) : (
              <div className="space-y-6">
                {plannerData.map((p) => {
                  const schedule = JSON.parse(p.schedule || "[]");

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-xl shadow-md border border-gray-200 p-5"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">
                          Class {p.class} —{" "}
                          <span className="text-indigo-600 font-medium">
                            {Array.isArray(p.subjects)
                              ? p.subjects.join(", ")
                              : p.subjects}
                          </span>
                        </h3>
                        <span className="text-xs text-gray-400">
                          {new Date(p.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {schedule.map((item, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 border rounded-lg flex justify-between items-start"
                          >
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {item.time}
                              </p>
                              <p className="text-gray-700 mt-1">
                                <span className="font-medium text-indigo-600">
                                  {item.subject}
                                </span>{" "}
                                — {item.chapter}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.activity}
                              </p>
                            </div>

                            {/* removed checkbox/completion UI as requested */}
                            <div className="flex flex-col items-center">
                              <span className="text-xs mt-1 text-gray-500">
                                Planned
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "quiz" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Quiz Performance</h2>
            {quizData.length === 0 ? (
              <p>No quiz attempts yet.</p>
            ) : (
              <ul className="space-y-4">
                {quizData.map((q) => {
                  const totalQs = q.total_questions ?? DEFAULT_TOTAL_QUESTIONS;
                  const percent =
                    totalQs === 0
                      ? 0
                      : Math.round((Number(q.score || 0) / totalQs) * 100);
                  return (
                    <li key={q.id} className="bg-white p-4 rounded-lg shadow">
                      <p className="font-semibold">
                        Score: {q.score} / {totalQs} ({percent}%)
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(q.created_at).toLocaleString()}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">
                        Topic: {q.topic}
                      </div>
                      {/* hint: quiz explanation unlocking should be implemented in quiz.jsx and call spendCoins(10) */}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {activeTab === "achievements" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
            <p className="text-gray-600">🏆 Coming soon!</p>
          </section>
        )}

        {activeTab === "profile" && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">Welcome, {user.fullName}</p>
          </section>
        )}
      </main>

      {/* mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-lg">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center text-sm ${
              activeTab === item.id ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
