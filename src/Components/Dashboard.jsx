import { useState, useEffect, useCallback } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { supabase } from "../Supabase/supabaseClient";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  User,
  LogOut,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_TOTAL_QUESTIONS = 8;

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] = useState("overview");
  const [quizData, setQuizData] = useState([]);
  const [plannerData, setPlannerData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: "overview", icon: <BarChart3 size={22} />, label: "Overview" },
    { id: "planner", icon: <ClipboardList size={22} />, label: "Planner" },
    { id: "quiz", icon: <BookOpen size={22} />, label: "Quiz" },
    { id: "profile", icon: <User size={22} />, label: "Profile" },
    { id: "achievements", icon: <Trophy size={22} />, label: "Achievements" },
  ];

  // --------------------------
  // Supabase helpers
  // --------------------------
  const fetchCoins = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("coins")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) return 0;
      return data.balance ?? 0;
    } catch {
      return 0;
    }
  };

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
        // Planner
        if (opts.fetchPlanner) {
          const { data } = await supabase
            .from("planner_data")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          setPlannerData(data || []);
        }

        // Quiz
        if (opts.fetchQuiz) {
          const { data } = await supabase
            .from("quiz_data")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          setQuizData(data || []);
        }

        // Streak
        if (opts.fetchStreak) {
          const { data } = await supabase
            .from("streaks")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          setStreak(data?.current_streak ?? 0);
        }

        // Coins
        if (opts.fetchCoins) {
          const b = await fetchCoins(user.id);
          setCoins(b);
        }
      } catch (err) {
        console.error("loadDashboardData error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // --------------------------
  // Initial load
  // --------------------------
  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user, loadDashboardData]);

  // --------------------------
  // 🔥 REALTIME STREAK LISTENER
  // --------------------------
  useEffect(() => {
    if (!user) return;

    const streakChannel = supabase
      .channel(`public:streaks:user_${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "streaks", filter: `user_id=eq.${user.id}` },
        () => {
          console.log("Realtime streak update detected");
          loadDashboardData({
            fetchStreak: true,
            fetchCoins: false,
            fetchPlanner: false,
            fetchQuiz: false,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(streakChannel);
    };
  }, [user, loadDashboardData]);

  // --------------------------
  // 🪙 REALTIME COINS LISTENER
  // --------------------------
  useEffect(() => {
    if (!user) return;

    const coinsChannel = supabase
      .channel(`public:coins:user_${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "coins", filter: `user_id=eq.${user.id}` },
        () => {
          console.log("Realtime coins update detected");
          loadDashboardData({
            fetchCoins: true,
            fetchStreak: false,
            fetchPlanner: false,
            fetchQuiz: false,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coinsChannel);
    };
  }, [user, loadDashboardData]);

  // --------------------------
  // UI Logic
  // --------------------------
  if (!user)
    return <div className="p-6">Please log in to view your dashboard.</div>;

  if (loading) return <p className="p-6">Loading...</p>;

  const accuracy =
    quizData.length > 0
      ? Math.round(
          quizData.reduce((sum, q) => {
            const totalQs =
              Number(q.total_questions) || DEFAULT_TOTAL_QUESTIONS;
            const correct = Number(q.score) || 0;
            return sum + Math.round((correct / totalQs) * 100);
          }, 0) / quizData.length
        )
      : 0;

  // --------------------------
  // JSX Output
  // --------------------------
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">StudyFlow</h1>
        </div>

        <nav className="flex flex-col flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 p-4 border-t text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={22} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* ---------------- Overview ---------------- */}
        {activeTab === "overview" && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Overview
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Your Coins",
                  value: `🪙 ${coins}`,
                  color: "from-yellow-50 to-white",
                  text: "text-yellow-700",
                },
                {
                  label: "Study Streak",
                  value: `🔥 ${streak}`,
                  color: "from-indigo-50 to-white",
                  text: "text-indigo-700",
                },
                {
                  label: "Plans Created",
                  value: plannerData.length,
                  color: "from-green-50 to-white",
                  text: "text-green-700",
                },
                {
                  label: "Quiz Accuracy",
                  value: `${accuracy}%`,
                  color: "from-blue-50 to-white",
                  text: "text-blue-700",
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${card.color} rounded-xl shadow-md p-6 hover:shadow-lg transition`}
                >
                  <h3 className="text-gray-500 text-sm font-medium">
                    {card.label}
                  </h3>
                  <p className={`text-3xl font-bold mt-2 ${card.text}`}>
                    {card.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ---------------- Planner ---------------- */}
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
                        <h3 className="text-xl font-semibold text-gray-800">
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
                            className="p-4 bg-gray-50 border rounded-lg flex justify-between items-start hover:bg-gray-100 transition"
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
                            <span className="text-xs mt-1 text-gray-500">
                              Planned
                            </span>
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

        {/* ---------------- Quiz ---------------- */}
        {activeTab === "quiz" && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Quiz Performance
            </h2>

            {/* Summary Card */}
            {quizData.length > 0 && (
              <div className="mb-6 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700">
                    Total Quizzes: {quizData.length}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Overall Accuracy:{" "}
                    <span className="font-semibold text-green-600">
                      {accuracy}%
                    </span>
                  </p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
            )}

            {/* Empty State */}
            {quizData.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-4xl mb-3">🧩</p>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  No Quiz Attempts Yet
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Take your first quiz to start tracking your performance!
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {quizData.map((q) => {
                  const totalQs = q.total_questions ?? DEFAULT_TOTAL_QUESTIONS;
                  const percent = Math.round(
                    (Number(q.score || 0) / totalQs) * 100
                  );

                  const percentColor =
                    percent >= 80
                      ? "text-green-600"
                      : percent >= 50
                      ? "text-yellow-600"
                      : "text-red-600";

                  return (
                    <motion.li
                      key={q.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-white to-indigo-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-lg font-semibold text-gray-800">
                          Score:{" "}
                          <span className="text-indigo-700">{q.score}</span> /{" "}
                          {totalQs}
                        </p>
                        <span
                          className={`text-sm font-semibold ${percentColor}`}
                        >
                          {percent}% Accuracy
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Topic:</span>{" "}
                        {q.topic || "N/A"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(q.created_at).toLocaleString()}
                      </p>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {/* ---------------- Achievements ---------------- */}
        {activeTab === "achievements" && (
          <section className="text-center py-20">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center rounded-full shadow-inner mb-6">
                <Trophy size={36} className="text-indigo-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Achievements Coming Soon!
              </h2>
              <p className="text-gray-600 max-w-md mx-auto text-sm">
                We're working on adding exciting achievements and rewards to
                keep you motivated. Stay tuned — they'll appear here soon! 🚀
              </p>
            </div>
          </section>
        )}

        {/* ---------------- Profile ---------------- */}
        {activeTab === "profile" && (
          <section className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Your Profile
            </h2>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow-sm"
              />

              <div className="text-center sm:text-left">
                <h3 className="text-xl font-semibold text-gray-800">
                  {user.fullName} 👋
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {user.primaryEmailAddress?.emailAddress}
                </p>

                <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                  Welcome back to{" "}
                  <span className="font-medium text-indigo-600">StudyFlow</span>
                  . You're doing great — stay consistent, keep learning, and
                  track your progress easily.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-indigo-50 rounded-lg p-4 text-center border border-indigo-100">
                <p className="text-lg font-semibold text-indigo-700">
                  {plannerData.length}
                </p>
                <p className="text-sm text-gray-600">Plans Created</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                <p className="text-lg font-semibold text-green-700">
                  {quizData.length}
                </p>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-100">
                <p className="text-lg font-semibold text-yellow-700">
                  {streak}
                </p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t flex justify-around py-2 shadow-lg">
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
