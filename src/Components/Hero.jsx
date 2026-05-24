 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../Components/Navbar";

// ─── Constants ────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1];

const SUBJECTS = [
  { label: "Physics",   color: "#EDE9FE", text: "#6D28D9" },
  { label: "Chemistry", color: "#FEF3C7", text: "#D97706" },
  { label: "Maths",     color: "#ECFDF5", text: "#059669" },
  { label: "Biology",   color: "#EFF6FF", text: "#2563EB" },
];

const STREAK     = [true, true, true, true, false, true, true];
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const BAR_HEIGHTS = [28, 44, 20, 62, 48, 72, 55];

const TAGS = ["📅 Study Planner", "📝 Board Quiz", "📊 Chapter Tracker", "🎯 Focus Mode"];

const STATS = [
  { to: 180, suffix: "+",  label: "Active Students"    },
  { to: 10,  suffix: "k+", label: "Quizzes Completed"  },
  { to: 92,  suffix: "%",  label: "Weekly Consistency" },
];

const TASKS = [
  { title: "Physics — Laws of Motion", time: "7:00 PM",  dur: "45 min", done: true,  color: "#6D28D9" },
  { title: "Math Mock Test (Ch 5–8)",  time: "8:30 PM",  dur: "50 min", done: false, color: "#2563EB" },
  { title: "Chemistry — Reactions",    time: "10:00 PM", dur: "30 min", done: false, color: "#D97706" },
];

const CHAPTERS = [
  { label: "Laws of Motion",      pct: 85, color: "#6D28D9" },
  { label: "Chemical Reactions",  pct: 60, color: "#D97706" },
  { label: "Coordinate Geometry", pct: 40, color: "#2563EB" },
];

const QUESTIONS = [
  "What is Newton's Second Law of Motion?",
  "Define Photosynthesis in plants.",
  "Solve: ∫ x² dx from 0 to 3.",
];

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.78, delay, ease },
  }),
};

const staggerList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const listItem = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease } },
};

// ─── Counter (UNCHANGED logic) ────────────────────────────────────────────────

function Counter({ from = 0, to, suffix = "" }) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    let start = from;
    const duration = 1800;
    const increment = to / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) { start = to; clearInterval(timer); }
      setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [from, to]);
  return <span>{value}{suffix}</span>;
}

// ─── Blinking cursor ──────────────────────────────────────────────────────────

function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="ml-0.5 inline-block h-[1em] w-[2px] rounded-full bg-indigo-400 align-middle"
    />
  );
}

// ─── Floating badge (desktop only) ───────────────────────────────────────────

function FloatingBadge({ delay, offsetClass, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -9, 0] }}
      transition={{
        opacity: { duration: 0.5, delay, ease },
        y: { duration: 4.8 + delay, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`absolute z-20 hidden lg:block ${offsetClass} rounded-2xl border border-black/[0.06] bg-white/95 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.05)]`}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard() {
  const [activeTab, setActiveTab] = useState(0);
  const [qIdx, setQIdx]           = useState(0);
  const tabs = ["Study Plan", "Quiz Mode", "Progress"];

  useEffect(() => {
    const t = setInterval(() => setQIdx(i => (i + 1) % QUESTIONS.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.10),0_4px_16px_rgba(0,0,0,0.05)] sm:rounded-[28px]">

      {/* Mac chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-black/[0.05] bg-[#FAFAFA] px-4 py-3 sm:px-5 sm:py-3.5">
        <div className="h-[9px] w-[9px] rounded-full bg-red-300/90" />
        <div className="h-[9px] w-[9px] rounded-full bg-amber-300/90" />
        <div className="h-[9px] w-[9px] rounded-full bg-emerald-300/90" />

        <div className="mx-3 flex flex-1 items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-md bg-black/[0.04] px-3 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-medium text-gray-400 tracking-[-0.01em]">studyflow.app</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`rounded-md px-2 py-1 text-[9px] font-semibold tracking-[-0.01em] transition-all duration-200 sm:px-2.5 ${
                activeTab === i ? "bg-indigo-50 text-indigo-600" : "text-gray-300 hover:text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* TAB 0: Study Plan */}
        {activeTab === 0 && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease }}
            style={{ padding: "14px" }}
            className="grid gap-2.5"
          >
            <div className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-[#F9FAFB] px-3.5 py-2.5">
              <div>
                <p className="text-[8.5px] font-semibold uppercase tracking-wider text-gray-400">Today</p>
                <p className="mt-0.5 text-[12.5px] font-semibold tracking-[-0.01em] text-gray-800">
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[8.5px] font-semibold uppercase tracking-wider text-gray-400">Streak</p>
                <div className="flex gap-1">
                  {STREAK.map((done, i) => (
                    <div key={i} className={`h-1.5 w-3.5 rounded-full ${done ? "bg-indigo-500" : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="text-[8.5px] font-medium text-indigo-500">6-day streak 🔥</p>
              </div>
            </div>

            <motion.div variants={staggerList} initial="hidden" animate="visible" className="flex flex-col gap-2">
              {TASKS.map((task, i) => (
                <motion.div
                  key={i}
                  variants={listItem}
                  className="flex items-center justify-between rounded-xl border border-black/[0.04] bg-white px-3 py-2.5 hover:border-black/[0.08] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-6 w-[3px] flex-shrink-0 rounded-full" style={{ background: task.color + (task.done ? "55" : "cc") }} />
                    <div>
                      <p className={`text-[11px] font-semibold leading-none tracking-[-0.01em] ${task.done ? "text-gray-300 line-through" : "text-gray-800"}`}>
                        {task.title}
                      </p>
                      <p className="mt-[3px] text-[9px] font-medium text-gray-400">{task.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8.5px] font-medium text-gray-300">{task.dur}</span>
                    {task.done ? (
                      <div className="flex h-[17px] w-[17px] flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 shadow-sm shadow-indigo-200">
                        <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                          <path d="M1 5L4 8L9 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-[17px] w-[17px] flex-shrink-0 rounded-full border-2 border-gray-200" />
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 px-3 py-2.5">
              <div className="flex h-[17px] w-[17px] items-center justify-center rounded-full border-2 border-indigo-200">
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v8M1 5h8" stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[10.5px] font-medium text-gray-300">
                Add revision session<Cursor />
              </span>
            </div>
          </motion.div>
        )}

        {/* TAB 1: Quiz Mode */}
        {activeTab === 1 && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease }}
            style={{ padding: "14px" }}
            className="grid gap-2.5"
          >
            <div>
              <p className="mb-2 text-[8.5px] font-semibold uppercase tracking-wider text-gray-400">Choose Subject</p>
              <div className="flex flex-wrap gap-1.5">
                {SUBJECTS.map((s, i) => (
                  <motion.span
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.06 + i * 0.07, ease }}
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer rounded-full px-3 py-1.5 text-[10.5px] font-semibold"
                    style={{ background: s.color, color: s.text }}
                  >
                    {s.label}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.05] bg-[#F9FAFB] p-3.5">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-indigo-500">Q12 of 40</span>
                <span className="ml-auto text-[8.5px] font-semibold text-gray-400">⏱ 28:14 left</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={qIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.28, ease }}
                  className="text-[12px] font-semibold leading-snug tracking-[-0.01em] text-gray-800"
                >
                  {QUESTIONS[qIdx]}
                </motion.p>
              </AnimatePresence>
              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                {["Option A", "Option B", "Option C", "Option D"].map((opt, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border px-2.5 py-2 text-[10px] font-medium ${
                      i === 1 ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-black/[0.05] bg-white text-gray-500"
                    }`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.04] bg-white px-3 py-2.5">
              <div className="mb-1 flex justify-between">
                <span className="text-[8.5px] font-semibold uppercase tracking-wider text-gray-400">Progress</span>
                <span className="text-[8.5px] font-semibold text-indigo-500">12 / 40</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 1.2, delay: 0.3, ease }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Progress */}
        {activeTab === 2 && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease }}
            style={{ padding: "14px" }}
            className="grid gap-2.5"
          >
            <div className="rounded-2xl border border-black/[0.05] bg-[#F9FAFB] p-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-[8.5px] font-semibold uppercase tracking-wider text-gray-400">Sessions this week</p>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8.5px] font-semibold text-emerald-600">+3 vs last week</span>
              </div>
              <div className="flex items-end gap-1.5" style={{ height: 60 }}>
                {BAR_HEIGHTS.map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease }}
                      style={{ originY: 1, height: h }}
                      className={`w-full rounded-full ${i === 5 ? "bg-gradient-to-t from-indigo-600 to-violet-500" : "bg-indigo-100"}`}
                    />
                    <span className={`text-[7.5px] font-semibold ${i === 5 ? "text-indigo-500" : "text-gray-300"}`}>
                      {DAY_LABELS[i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.05] bg-[#F9FAFB] p-3.5">
              <p className="mb-2.5 text-[8.5px] font-semibold uppercase tracking-wider text-gray-400">Chapter Completion</p>
              {CHAPTERS.map((ch, i) => (
                <div key={i} className="mb-2.5 last:mb-0">
                  <div className="mb-1 flex justify-between">
                    <span className="text-[10px] font-medium text-gray-600">{ch.label}</span>
                    <span className="text-[9.5px] font-semibold" style={{ color: ch.color }}>{ch.pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ch.pct}%` }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.15, ease }}
                      className="h-full rounded-full"
                      style={{ background: ch.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5">
              <span className="text-sm leading-none">💡</span>
              <p className="text-[10.5px] font-medium leading-snug text-indigo-700">
                You study best between <strong>7–9 PM</strong>. Next session in 2 hrs.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────

export default function Hero() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative overflow-hidden bg-[#F7F8FA] text-[#111827]">

      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[-80px] h-[440px] w-[680px] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-[90px] sm:h-[560px] sm:w-[860px]"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, -26, 0], y: [0, 24, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-24 top-32 h-[260px] w-[260px] rounded-full bg-violet-200/28 blur-[64px] sm:h-[360px] sm:w-[360px]"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { x: [0, 20, 0], y: [0, -14, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-10 -left-10 h-[180px] w-[300px] rounded-full bg-sky-100/35 blur-[60px]"
        />
        <div
          className="absolute inset-0 opacity-[0.016]"
          style={{ backgroundImage: "radial-gradient(circle, #111827 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      <Navbar />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-26 lg:flex-row lg:items-center lg:gap-14 lg:px-12 xl:gap-20">

        {/* LEFT: Copy */}
        <div className="flex-1 lg:max-w-[540px] xl:max-w-[600px]">

          {/* Trust badge */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-white px-4 py-2 shadow-sm sm:mb-7"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-55" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[12px] font-medium tracking-[-0.01em] text-gray-500 sm:text-[12.5px]">
              Trusted by 250+ students
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={0.08}
            className="text-[36px] font-semibold leading-[1.06] tracking-[-0.032em] text-black sm:text-[52px] md:text-[58px] lg:text-[60px] xl:text-[68px]"
          >
            Build a study routine
            <br />
            <span style={{ color: "#9CA3AF" }}>you'll actually follow.</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0.17}
            className="mt-4 max-w-[380px] text-[14px] leading-[1.78] text-gray-500 sm:mt-5 sm:max-w-[420px] sm:text-[16px] lg:text-[15.5px]"
          >
            StudyFlow helps you plan sessions, practice board questions,
            track chapters, and stay consistent — without the overwhelm.
          </motion.p>

          {/* Feature tags */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.24}
            className="mt-4 flex flex-wrap gap-2 sm:mt-5"
          >
            {TAGS.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.04, y: -1 }}
                className="cursor-default rounded-full border border-black/[0.06] bg-white px-3 py-1 text-[11px] font-medium text-gray-600 shadow-sm sm:text-[11.5px]"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.32}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.018, y: -1.5 }}
              whileTap={{ scale: 0.972 }}
              onClick={() => navigate("/planner")}
              className="group relative overflow-hidden rounded-2xl bg-black px-6 py-3.5 text-[13px] font-medium text-white shadow-[0_2px_20px_rgba(0,0,0,0.18)] transition-shadow duration-300 hover:shadow-[0_4px_28px_rgba(0,0,0,0.26)] sm:px-7 sm:py-4 sm:text-[13.5px]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start studying
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >→</motion.span>
              </span>
              <motion.span
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.36, ease }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700"
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.012, y: -1 }}
              whileTap={{ scale: 0.972 }}
              onClick={() => {
                const el = document.getElementById("features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-black/[0.08] bg-white/80 px-6 py-3.5 text-[13px] font-medium text-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-black/[0.14] hover:bg-white hover:shadow-sm sm:px-7 sm:py-4 sm:text-[13.5px]"
            >
              Explore platform
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.42}
            className="mt-10 flex flex-wrap items-start gap-x-7 gap-y-4 sm:mt-12 sm:gap-x-10"
          >
            {STATS.map(({ to, suffix, label }) => (
              <div key={label}>
                <p className="text-[20px] font-semibold tracking-[-0.025em] text-black sm:text-[26px] lg:text-[28px]">
                  <Counter to={to} suffix={suffix} />
                </p>
                <p className="mt-0.5 text-[10.5px] font-medium text-gray-400 sm:text-[12.5px]">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Product card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0.48}
          className="relative mx-auto mt-12 w-full max-w-[320px] flex-shrink-0 sm:mt-14 sm:max-w-[380px] lg:mt-0 lg:w-[390px] xl:w-[430px]"
        >
          <FloatingBadge delay={0.75} offsetClass="-right-3 -top-6 xl:-right-6">
            <div className="px-4 py-3">
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-gray-400">Focus Mode</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[12.5px] font-semibold text-gray-800">Session active</span>
              </div>
            </div>
          </FloatingBadge>

          <FloatingBadge delay={0.95} offsetClass="-bottom-5 -left-5 xl:-left-8">
            <div className="px-3.5 py-2.5">
              <p className="text-[9.5px] font-semibold uppercase tracking-wider text-gray-400">Board Practice</p>
              <p className="mt-0.5 text-[12.5px] font-semibold text-indigo-600">40 MCQs ready</p>
            </div>
          </FloatingBadge>

          {/* Card ambient glow */}
          <div
            className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-40 blur-[40px]"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)" }}
          />

          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeroCard />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}