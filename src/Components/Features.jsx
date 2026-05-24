 import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  CalendarDays,
  BrainCircuit,
  FileText,
  BarChart3,
} from "lucide-react";

const FEATURES = [
  {
  
    title: "Daily Study Planner",
    description:
      "Create smart chapter-wise plans and stay consistent every day.",
    button: "Open planner",
    link: "/planner",
    color: "indigo",
    icon: CalendarDays,
    preview: "planner",
  },
  {
    
    title: "Smart AI Quiz",
    description:
      "Practice chapter-wise quizzes and improve your daily accuracy.",
    button: "Start quiz",
    link: "/quiz",
    color: "emerald",
    icon: BrainCircuit,
    preview: "quiz",
  },
  {
    
    title: "Board Practice Zone",
    description:
      "Solve PYQs, passages, mock tests, and prepare for boards.",
    button: "Start practice",
    link: "/board-practice",
    color: "violet",
    icon: FileText,
    preview: "board",
  },
  {
  
    title: "Performance Dashboard",
    description:
      "Track streaks, coins, quizzes, and your complete progress.",
    button: "Open dashboard",
    link: "/dashboard",
    color: "sky",
    icon: BarChart3,
    preview: "dashboard",
  },
];

const COLORS = {
  indigo: {
    bg: "bg-indigo-600 hover:bg-indigo-700",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    glow: "from-indigo-100/70",
  },

  emerald: {
    bg: "bg-emerald-600 hover:bg-emerald-700",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    glow: "from-emerald-100/70",
  },

  violet: {
    bg: "bg-violet-600 hover:bg-violet-700",
    light: "bg-violet-50",
    text: "text-violet-600",
    glow: "from-violet-100/70",
  },

  sky: {
    bg: "bg-sky-600 hover:bg-sky-700",
    light: "bg-sky-50",
    text: "text-sky-600",
    glow: "from-sky-100/70",
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function PlannerPreview() {
  return (
    <div className="mt-5 flex flex-col gap-2">
      {[
        ["Physics Revision", true],
        ["Math Practice", false],
        ["Chemistry Quiz", false],
      ].map(([task, done], i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: -10,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: i * 0.08,
          }}
          className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-3 py-2.5"
        >
          <div className="flex items-center gap-3">

            <div
              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                done
                  ? "border-indigo-600 bg-indigo-600"
                  : "border-gray-300"
              }`}
            >
              {done && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>

            <span
              className={`text-[13px] ${
                done
                  ? "text-gray-400 line-through"
                  : "text-gray-700"
              }`}
            >
              {task}
            </span>
          </div>

          <span className="text-[11px] text-gray-400">
            45m
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function QuizPreview() {
  return (
    <div className="mt-5 rounded-2xl border border-black/5 bg-white p-4">

      {/* TOP */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-[13px] font-medium text-black">
            Physics Quiz
          </p>

          <p className="mt-1 text-[11px] text-gray-400">
            Chapter 7 • Motion
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1">
          <span className="text-[11px]">⚡</span>

          <span className="text-[11px] font-medium text-emerald-600">
            78%
          </span>
        </div>
      </div>

      {/* QUESTION */}
      <div className="mt-4 rounded-xl border border-black/5 bg-[#F9FAFB] p-3">
        <p className="text-[12px] text-gray-700">
          Speed of light is?
        </p>

        <div className="mt-3 flex flex-col gap-2">

          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <span className="text-[11px]">✅</span>

            <span className="text-[12px] text-gray-700">
              3×10⁸ m/s
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3 py-2">
            <span className="text-[11px]">○</span>

            <span className="text-[12px] text-gray-400">
              5×10⁶ m/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardPreview() {
  return (
    <div className="mt-5 flex flex-col gap-2">
      {[
        ["English Passage", "8/10"],
        ["2024 PYQ", "14/15"],
        ["Mock Test", "Ready"],
      ].map(([title, score], i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: i * 0.08,
          }}
          className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-3 py-2.5"
        >
          <span className="text-[13px] text-gray-700">
            {title}
          </span>

          <span className="text-[13px] font-medium text-black">
            {score}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2">
      {[
        ["🔥 Streak", "14d"],
        ["🪙 Coins", "340"],
        ["📈 Progress", "92%"],
        ["✅ Quizzes", "47"],
      ].map(([title, value], i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: i * 0.05,
          }}
          className="rounded-xl border border-black/5 bg-white p-3"
        >
          <p className="text-[10px] text-gray-400">
            {title}
          </p>

          <p className="mt-1 text-[15px] font-semibold text-black">
            {value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function FeatureCard({ item, isSignedIn }) {
  const color = COLORS[item.color];
  const Icon = item.icon;

  const isPlanner =
    item.preview === "planner";

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`group relative overflow-hidden rounded-[26px] border border-black/5 bg-white p-4 sm:p-5 ${
         ""
      }`}
      style={{
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* GLOW */}
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br ${
          color.glow
        } via-transparent to-transparent`}
      />

      {/* TOP */}
      <div className="relative z-10 flex items-start justify-between gap-4">

        {/* LEFT */}
        <div>

          {/* ICONS */}
          <div className="flex items-center gap-3">

            <span className="text-2xl">
              {item.emoji}
            </span>

            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color.light}`}
            >
              <Icon
                size={20}
                className={color.text}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* TITLE */}
          <h3 className="mt-5 text-lg sm:text-xl font-semibold tracking-tight text-black">
            {item.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
            {item.description}
          </p>
        </div>

        {/* BADGE */}
        {isPlanner && (
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600">
            ✨ Most used
          </div>
        )}
      </div>

      {/* PREVIEW */}
      <div
        className={`relative z-10 mt-5 rounded-2xl border border-black/5 p-3 ${
          isPlanner
            ? "bg-gradient-to-br from-indigo-50 to-white"
            : "bg-[#F9FAFB]"
        }`}
      >
        {item.preview === "planner" && (
          <PlannerPreview />
        )}

        {item.preview === "quiz" && (
          <QuizPreview />
        )}

        {item.preview === "board" && (
          <BoardPreview />
        )}

        {item.preview === "dashboard" && (
          <DashboardPreview />
        )}
      </div>

      {/* BUTTON */}
      <div className="relative z-10 mt-5">
        {isSignedIn ? (
          <Link to={item.link}>
            <button
              className={`w-full rounded-xl py-3 text-sm font-medium text-white transition-all duration-200 active:scale-[0.98] ${color.bg}`}
            >
              {item.button}
            </button>
          </Link>
        ) : (
          <SignInButton mode="modal">
            <button
              className={`w-full rounded-xl py-3 text-sm font-medium text-white transition-all duration-200 active:scale-[0.98] ${color.bg}`}
            >
              Sign in to continue
            </button>
          </SignInButton>
        )}
      </div>
    </motion.div>
  );
}

export default function Features() {
  const { isSignedIn } = useUser();

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#F7F8FA] px-4 py-16 sm:px-5 sm:py-20"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-0 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-100/30 blur-3xl" />

        <div className="absolute right-0 top-40 h-[250px] w-[250px] rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">

        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />

            <span className="text-[13px] text-gray-600">
              Everything students need
            </span>
          </div>

          {/* TITLE */}
          <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-black sm:text-5xl">
            Study smarter.
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {" "}Stay consistent.
            </span>
          </h2>

          {/* DESC */}
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-7 text-gray-500">
            Planning, quizzes, board prep, and progress tracking —
            all in one beautiful workspace built for students.
          </p>
        </motion.div>

        {/* GRID */}
        <motion.div
          variants={{
            hidden: {},

            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 auto-rows-fr"
        >
          {FEATURES.map((item, i) => (
            <FeatureCard
              key={i}
              item={item}
              isSignedIn={isSignedIn}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}