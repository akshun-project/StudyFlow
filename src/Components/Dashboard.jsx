  // src/Components/Dashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { supabase } from "../Supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  User,
  LogOut,
  Trophy,
  Home,
  TrendingUp,
  CheckCircle2,
  Circle,
  Flame,
  Coins,
  Target,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCoins } from "../utils/coinUtils";

// ─── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_TOTAL_QUESTIONS = 8;

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const tabContent = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─── Reusable UI Primitives ───────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 ${className}`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children, sub }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">{children}</h2>
      {sub && <p className="text-sm text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function EmptyState({ icon, title, desc, action, onAction }) {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">{desc}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-indigo-200"
        >
          {action} <ArrowRight size={14} />
        </button>
      )}
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse p-6">
      <div className="h-6 w-40 bg-slate-100 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="h-48 rounded-2xl bg-slate-100" />
        <div className="h-48 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, iconBg, iconColor, sub, trend }) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="p-5 flex flex-col gap-3 group hover:border-slate-300 transition-colors duration-200">
        <div className="flex items-start justify-between">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon size={16} className={iconColor} />
          </div>
          {trend !== undefined && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{value}</p>
          <p className="text-xs text-slate-400 font-medium mt-1.5">{label}</p>
          {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Accuracy Ring ────────────────────────────────────────────────────────────

function AccuracyRing({ value }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = ((value || 0) / 100) * circ;
  const color = value >= 80 ? "#10B981" : value >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#F1F5F9" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="48" y="52" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0F172A">
          {value}%
        </text>
      </svg>
      <p className="text-xs text-slate-400 font-medium">Quiz Accuracy</p>
    </div>
  );
}

// ─── Mini Activity Heatmap (last 28 days) ─────────────────────────────────────

function ActivityHeatmap({ quizData, plannerData }) {
  const days = 28;
  const today = new Date();

  const activityMap = {};
  [...(quizData || []), ...(plannerData || [])].forEach((item) => {
    const d = new Date(item.created_at).toDateString();
    activityMap[d] = (activityMap[d] || 0) + 1;
  });

  const cells = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const key = d.toDateString();
    const count = activityMap[key] || 0;
    return { key, count, label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) };
  });

  const getColor = (count) => {
    if (count === 0) return "bg-slate-100";
    if (count === 1) return "bg-indigo-200";
    if (count === 2) return "bg-indigo-400";
    return "bg-indigo-600";
  };

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Activity — last 28 days</p>
      <div className="grid grid-cols-14 gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}>
        {cells.map((c) => (
          <div
            key={c.key}
            title={`${c.label}: ${c.count} activities`}
            className={`aspect-square rounded-sm ${getColor(c.count)} transition-colors`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] text-slate-400">Less</span>
        {["bg-slate-100", "bg-indigo-200", "bg-indigo-400", "bg-indigo-600"].map((c) => (
          <span key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-[10px] text-slate-400">More</span>
      </div>
    </div>
  );
}

// ─── Streak Flame Display ─────────────────────────────────────────────────────

function StreakDisplay({ streak }) {
  const level = streak >= 30 ? "legendary" : streak >= 14 ? "fire" : streak >= 7 ? "warm" : "new";
  const messages = {
    legendary: "You're on fire 🏆 Legendary streak!",
    fire: "Incredible momentum 🔥 Keep it up!",
    warm: "Great habit forming! 💪",
    new: "Every streak starts with day 1. Go!",
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
          streak > 0 ? "bg-amber-50 border border-amber-200" : "bg-slate-50 border border-slate-200"
        }`}>
          {streak > 0 ? "🔥" : "💤"}
        </div>
        {streak > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
            {streak}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 tabular-nums">{streak} <span className="text-base font-medium text-slate-400">days</span></p>
        <p className="text-xs text-slate-500 mt-0.5 max-w-[180px] leading-snug">{messages[level]}</p>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ coins, streak, plannerData, quizData, accuracy, navigate }) {
  return (
    <motion.div variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">

      {/* Stat cards */}
      <motion.div variants={stagger} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Coins earned" value={coins} icon={Zap}
          iconBg="bg-amber-50" iconColor="text-amber-500" sub="Spend to unlock hints" />
        <StatCard label="Study streak" value={`${streak}d`} icon={Flame}
          iconBg="bg-orange-50" iconColor="text-orange-500" sub={streak > 0 ? "Keep it going!" : "Start today"} />
        <StatCard label="Plans created" value={plannerData.length} icon={ClipboardList}
          iconBg="bg-indigo-50" iconColor="text-indigo-500" sub="Chapter schedules" />
        <StatCard label="Quiz accuracy" value={`${accuracy}%`} icon={Target}
          iconBg="bg-emerald-50" iconColor="text-emerald-500"
          sub={quizData.length > 0 ? `Over ${quizData.length} quizzes` : "No quizzes yet"} />
      </motion.div>

      {/* Middle row: streak + accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 flex flex-col gap-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Current streak</p>
          <StreakDisplay streak={streak} />
          <div className="grid grid-cols-7 gap-1 mt-1">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400">{d}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  i < (streak % 7) ? "bg-amber-100 border border-amber-300" : "bg-slate-100"
                }`}>
                  {i < (streak % 7) && <CheckCircle2 size={12} className="text-amber-500" />}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Performance</p>
          <div className="flex items-center justify-center flex-1 py-2">
            <AccuracyRing value={accuracy} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <p className="text-lg font-bold text-slate-900">{quizData.length}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Quizzes taken</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-3 text-center border border-indigo-100">
              <p className="text-lg font-bold text-indigo-700">{coins}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Coins balance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity heatmap */}
      <Card className="p-5">
        <ActivityHeatmap quizData={quizData} plannerData={plannerData} />
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Create study plan", icon: "📝", path: "/planner", accent: "indigo" },
          { label: "Take a quiz", icon: "⚡", path: "/quiz", accent: "violet" },
          { label: "Board practice", icon: "🎯", path: "/board-practice", accent: "sky" },
        ].map(({ label, icon, path, accent }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border bg-white hover:bg-${accent}-50 hover:border-${accent}-200 text-slate-700 hover:text-${accent}-700 transition-all group text-sm font-medium`}
          >
            <span className="text-lg">{icon}</span>
            {label}
            <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-current group-hover:translate-x-0.5 transition-all" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Planner Tab ──────────────────────────────────────────────────────────────

function PlannerTab({ plannerData, navigate }) {
  if (!plannerData.length) return (
    <EmptyState
      icon="📝"
      title="No study plans yet"
      desc="Create your first AI-powered chapter-wise study plan. It takes under 60 seconds."
      action="Create plan"
      onAction={() => navigate("/planner")}
    />
  );

  return (
    <motion.div variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
      <SectionHeading sub={`${plannerData.length} plan${plannerData.length > 1 ? "s" : ""} total`}>
        Your Study Plans
      </SectionHeading>

      {plannerData.map((p) => {
        const schedule = JSON.parse(p.schedule || "[]");
        return (
          <Card key={p.id} className="overflow-hidden">
            {/* Plan header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Class {p.class} —{" "}
                  <span className="text-indigo-600">
                    {Array.isArray(p.subjects) ? p.subjects.join(", ") : p.subjects}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {new Date(p.created_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-full">
                {schedule.length} sessions
              </span>
            </div>

            {/* Schedule list */}
            <div className="divide-y divide-slate-50">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mt-0.5">
                    <span className="text-[10px] font-bold text-indigo-500">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-700">{item.time}</span>
                      <span className="text-xs font-semibold text-indigo-600">{item.subject}</span>
                      <span className="text-xs text-slate-400">— {item.chapter}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.activity}</p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full mt-0.5">
                    Planned
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </motion.div>
  );
}

// ─── Quiz Tab ─────────────────────────────────────────────────────────────────

function QuizTab({ quizData, accuracy, navigate }) {
  if (!quizData.length) return (
    <EmptyState
      icon="⚡"
      title="No quizzes attempted yet"
      desc="Take your first quiz, earn 5 coins, and start building your accuracy score."
      action="Take a quiz"
      onAction={() => navigate("/quiz")}
    />
  );

  return (
    <motion.div variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
      {/* Summary card */}
      <Card className="p-5 flex items-center gap-5">
        <AccuracyRing value={accuracy} />
        <div className="flex-1 flex flex-col gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">{quizData.length} quizzes taken</p>
            <p className="text-sm text-slate-400">Overall accuracy across all attempts</p>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      </Card>

      <SectionHeading sub="Most recent first">Quiz history</SectionHeading>

      <div className="flex flex-col gap-3">
        {quizData.map((q) => {
          const totalQs = q.total_questions ?? DEFAULT_TOTAL_QUESTIONS;
          const percent = Math.round((Number(q.score || 0) / totalQs) * 100);
          const isGood = percent >= 80;
          const isMid = percent >= 50 && percent < 80;

          return (
            <Card key={q.id} className="p-4 flex items-center gap-4 hover:border-slate-300 transition-colors">
              {/* Score ring mini */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center border border-slate-100 bg-slate-50">
                <span className="text-sm font-bold text-slate-900 tabular-nums">{percent}%</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800">
                    {q.score} / {totalQs} correct
                  </p>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    isGood ? "bg-emerald-50 text-emerald-600" :
                    isMid  ? "bg-amber-50 text-amber-600" :
                             "bg-red-50 text-red-500"
                  }`}>
                    {isGood ? "Excellent" : isMid ? "Good" : "Needs work"}
                  </span>
                </div>

                <div className="mt-1.5 h-1 rounded-full bg-slate-100 overflow-hidden w-full">
                  <div
                    className={`h-full rounded-full ${isGood ? "bg-emerald-500" : isMid ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center gap-3 mt-1.5">
                  {q.topic && (
                    <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                      {q.topic}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {new Date(q.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Achievements Tab ─────────────────────────────────────────────────────────

function AchievementsTab({ streak, quizData, coins, plannerData }) {
  const { user } = useUser();
  const [boardData, setBoardData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("board_results")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .then((res) => setBoardData(res.data || []));
  }, [user]);

  const BADGES = [
    { label: "First Quiz", icon: "⚡", earned: quizData.length >= 1, desc: "Take your first quiz" },
    { label: "Quiz Master", icon: "🎯", earned: quizData.length >= 10, desc: "Complete 10 quizzes" },
    { label: "Planner Pro", icon: "📝", earned: plannerData.length >= 3, desc: "Create 3 study plans" },
    { label: "Week Streak", icon: "🔥", earned: streak >= 7, desc: "7-day study streak" },
    { label: "Coin Rich", icon: "🪙", earned: coins >= 100, desc: "Earn 100 coins" },
    { label: "Board Ready", icon: "🏆", earned: boardData.length >= 1, desc: "Complete a board test" },
  ];

  return (
    <motion.div variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
      <SectionHeading sub={`${BADGES.filter((b) => b.earned).length} of ${BADGES.length} earned`}>
        Achievements
      </SectionHeading>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BADGES.map((badge) => (
          <Card
            key={badge.label}
            className={`p-4 flex flex-col items-center gap-2 text-center transition-all ${
              badge.earned ? "" : "opacity-40 grayscale"
            }`}
          >
            <span className="text-3xl">{badge.icon}</span>
            <p className="text-xs font-bold text-slate-800">{badge.label}</p>
            <p className="text-[11px] text-slate-400 leading-snug">{badge.desc}</p>
            {badge.earned && (
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full">
                Earned ✓
              </span>
            )}
          </Card>
        ))}
      </div>

      {/* Board practice results */}
      <div>
        <SectionHeading sub={boardData.length ? `${boardData.length} tests completed` : undefined}>
          Board Practice Results
        </SectionHeading>

        {!boardData.length ? (
          <EmptyState
            icon="🎯"
            title="No board tests yet"
            desc="Start your first board-style practice test and unlock your achievement."
            action="Start board practice"
            onAction={() => navigate("/board-practice")}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {boardData.map((item) => (
              <Card key={item.id} className="p-4 flex items-center gap-4 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-lg flex-shrink-0">
                  🏆
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">{item.test_name}</p>
                    <span className="text-xs font-bold text-indigo-600">
                      {item.correct_answers}/{item.total_questions}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-slate-400">
                      Accuracy: <span className="font-semibold text-emerald-600">{item.accuracy}%</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {Math.floor(item.time_taken / 60)}m {item.time_taken % 60}s
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ user, plannerData, quizData, streak, coins, signOut }) {
  return (
    <motion.div variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5">
      {/* Profile card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={user.imageUrl}
              alt={user.fullName}
              className="w-16 h-16 rounded-2xl border-2 border-indigo-100 object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg font-bold text-slate-900">{user.fullName} 👋</h3>
            <p className="text-sm text-slate-400 mt-0.5">{user.primaryEmailAddress?.emailAddress}</p>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-sm">
              Welcome back to{" "}
              <span className="font-semibold text-indigo-600">StudyFlow</span>.
              Keep your streak alive and keep building momentum — you're doing great!
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Plans created", value: plannerData.length, bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" },
          { label: "Quizzes taken", value: quizData.length, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
          { label: "Day streak", value: `${streak}d`, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
          { label: "Coins earned", value: coins, bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
        ].map(({ label, value, bg, text, border }) => (
          <Card key={label} className={`${bg} border ${border} p-4 text-center`} style={{ boxShadow: "none" }}>
            <p className={`text-2xl font-bold ${text} tabular-nums`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors w-full sm:w-auto"
      >
        <LogOut size={16} />
        Sign out of StudyFlow
      </button>
    </motion.div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────

function SidebarItem({ item, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70"
      }`}
    >
      <span className={isActive ? "text-indigo-600" : ""}>{item.icon}</span>
      {item.label}
      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
    </button>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]     = useState("overview");
  const [quizData, setQuizData]       = useState([]);
  const [plannerData, setPlannerData] = useState([]);
  const [streak, setStreak]           = useState(0);
  const [coins, setCoins]             = useState(0);
  const [loading, setLoading]         = useState(true);

  const menuItems = [
    { id: "overview",      icon: <BarChart3 size={18} />,     label: "Overview" },
    { id: "planner",       icon: <ClipboardList size={18} />, label: "Planner" },
    { id: "quiz",          icon: <BookOpen size={18} />,      label: "Quiz" },
    { id: "achievements",  icon: <Trophy size={18} />,        label: "Achievements" },
    { id: "profile",       icon: <User size={18} />,          label: "Profile" },
  ];

  // ── Backend logic: untouched ──────────────────────────────────────────────
  const loadDashboardData = useCallback(
    async (opts = { fetchPlanner: true, fetchQuiz: true, fetchStreak: true, fetchCoins: true }) => {
      if (!user) return;
      setLoading(true);
      try {
        if (opts.fetchPlanner) {
          const { data } = await supabase.from("planner_data").select("*")
            .eq("user_id", user.id).order("created_at", { ascending: false });
          setPlannerData(data || []);
        }
        if (opts.fetchQuiz) {
          const { data } = await supabase.from("quiz_data").select("*")
            .eq("user_id", user.id).order("created_at", { ascending: false });
          setQuizData(data || []);
        }
        if (opts.fetchStreak) {
          const { data } = await supabase.from("streaks").select("*")
            .eq("user_id", user.id).maybeSingle();
          setStreak(data?.current_streak ?? 0);
        }
        if (opts.fetchCoins) {
          const bal = await getCoins(user.id);
          setCoins(bal);
        }
      } catch (err) {
        console.error("loadDashboardData error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => { if (user) loadDashboardData(); }, [user, loadDashboardData]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`public:streaks:user_${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "streaks", filter: `user_id=eq.${user.id}` },
        () => loadDashboardData({ fetchStreak: true, fetchQuiz: false, fetchPlanner: false, fetchCoins: false }))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [user, loadDashboardData]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`public:coins:user_${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "coins", filter: `user_id=eq.${user.id}` },
        () => loadDashboardData({ fetchCoins: true, fetchStreak: false, fetchPlanner: false, fetchQuiz: false }))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [user, loadDashboardData]);
  // ── end backend logic ─────────────────────────────────────────────────────

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F7FF]">
      <p className="text-slate-400 text-sm">Please sign in to view your dashboard.</p>
    </div>
  );

  if (loading) return (
    <div className="flex min-h-screen bg-[#F8F7FF]">
      <div className="hidden md:block w-60 bg-white border-r border-slate-200" />
      <div className="flex-1"><LoadingSkeleton /></div>
    </div>
  );

  const accuracy = quizData.length > 0
    ? Math.round(quizData.reduce((sum, q) => {
        const totalQs = Number(q.total_questions) || DEFAULT_TOTAL_QUESTIONS;
        return sum + Math.round((Number(q.score || 0) / totalQs) * 100);
      }, 0) / quizData.length)
    : 0;

  const tabProps = { coins, streak, plannerData, quizData, accuracy, navigate };

  return (
    <div className="flex min-h-screen bg-[#F8F7FF] font-sans">

      {/* ── Desktop Sidebar ───────── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200/80 sticky top-0 h-screen">

        {/* Logo */}
         
<div className="px-5 py-5 border-b border-slate-100">
  <button
    onClick={() => navigate("/")}
    className="flex items-center gap-2.5 group"
  >
    {/* Premium Logo Icon */}
    <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-200">
      <div className="absolute inset-[1px] rounded-2xl bg-white/10 backdrop-blur-sm" />

      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10"
      >
        <path
          d="M5 17L12 6L19 17"
          stroke="white" 
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 13H15.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>

    {/* Text Logo */}
    <div className="flex flex-col leading-none">
      <span className="text-[22px] font-semibold tracking-[-0.03em]">
        <span className="text-black">Study</span>

        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Flow
        </span>
      </span>

      
    </div>
  </button>
</div>

        {/* User summary */}
        <div className="px-4 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img src={user.imageUrl} alt={user.fullName}
              className="w-8 h-8 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                {user.firstName || user.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-amber-600 font-medium">🪙 {coins}</span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-orange-500 font-medium">🔥 {streak}d</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-slate-100 flex flex-col gap-1">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
          >
            <Home size={18} /> Back to home
          </button>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#F8F7FF]/90 backdrop-blur-md border-b border-slate-200/60 px-5 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-slate-900 capitalize">{activeTab}</p>
            <p className="text-xs text-slate-400 hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          {/* Mobile coin + streak display */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full">🪙 {coins}</span>
            <span className="text-xs font-semibold bg-orange-50 border border-orange-200 text-orange-600 px-2.5 py-1 rounded-full">🔥 {streak}d</span>
          </div>
        </div>

        {/* Tab content */}
        <div className="px-4 sm:px-6 py-6 max-w-4xl">
          <AnimatePresence mode="wait">
            {activeTab === "overview"     && <OverviewTab     key="overview"     {...tabProps} />}
            {activeTab === "planner"      && <PlannerTab      key="planner"      plannerData={plannerData} navigate={navigate} />}
            {activeTab === "quiz"         && <QuizTab         key="quiz"         quizData={quizData} accuracy={accuracy} navigate={navigate} />}
            {activeTab === "achievements" && <AchievementsTab key="achievements" streak={streak} quizData={quizData} coins={coins} plannerData={plannerData} />}
            {activeTab === "profile"      && <ProfileTab      key="profile"      user={user} plannerData={plannerData} quizData={quizData} streak={streak} coins={coins} signOut={signOut} />}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile bottom nav ────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-t border-slate-200/80"
        style={{ boxShadow: "0 -4px 24px rgba(0,0,0,0.06)" }}>
        <div className="flex justify-around px-2 py-2 safe-area-inset-bottom">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === item.id
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <span className={`transition-all ${activeTab === item.id ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-semibold ${activeTab === item.id ? "text-indigo-600" : "text-slate-400"}`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-indigo-500" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}