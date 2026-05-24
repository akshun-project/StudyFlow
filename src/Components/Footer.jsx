 import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      {
        name: "Study Planner",
        to: "/planner",
      },

      {
        name: "AI Quiz",
        to: "/quiz",
      },

      {
        name: "Board Practice",
        to: "/board-practice",
      },

      {
        name: "Dashboard",
        to: "/dashboard",
      },
    ],
  },

  {
    title: "Connect",
    links: [
      {
        name: "support@studyflow.com",
        to: "#",
      },

      {
        name: "@studyflow_ai",
        to: "#",
      },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#1F0A4D] via-[#2B1063] to-[#18063B] pt-20 text-white">

      {/* TOP GLOW LINE */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* TOP */}
        <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* LEFT */}
        <div className="absolute left-0 bottom-0 h-[280px] w-[280px] rounded-full bg-violet-500/20 blur-3xl" />

        {/* RIGHT */}
        <div className="absolute right-0 top-10 h-[260px] w-[260px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">

        {/* TOP */}
        <div className="flex flex-col gap-14 border-b border-white/10 pb-12 lg:flex-row lg:items-start lg:justify-between">

          {/* LEFT */}
          <div className="max-w-md">

            {/* LOGO */}
            <Link
              to="/"
              className="inline-flex select-none items-center"
            >
              <span className="text-[24px] font-semibold tracking-[-0.03em]">
                <span className="text-white">
                  Study
                </span>

                <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  Flow
                </span>
              </span>
            </Link>

            {/* DESCRIPTION */}
            <p className="mt-5 text-[15px] leading-7 text-white/75">
              StudyFlow helps students stay consistent with smart study plans,
              AI quizzes, board practice, and real-time progress tracking —
              all in one focused workspace.
            </p>

            {/* FLOATING TAG */}
            <motion.div
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-xl"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[13px] text-white/80">
                Built for modern students
              </span>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">

            {FOOTER_LINKS.map((section) => (
              <div key={section.title}>

                {/* TITLE */}
                <h3 className="text-sm font-semibold text-white">
                  {section.title}
                </h3>

                {/* LINKS */}
                <ul className="mt-5 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>

                      <Link
                        to={link.to}
                        className="group inline-flex items-center gap-2 text-[14px] text-white/70 transition-all duration-200 hover:text-indigo-300"
                      >
                        <span>
                          {link.name}
                        </span>

                        <span className="translate-y-[1px] opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">

          {/* LEFT */}
          <p className="text-[13px] text-white/50">
            © 2026 StudyFlow. All rights reserved.
          </p>

          {/* RIGHT */}
          <div className="flex items-center justify-center gap-5 sm:justify-end">

            <button className="text-[13px] text-white/50 transition hover:text-indigo-300">
              Privacy
            </button>

            <button className="text-[13px] text-white/50 transition hover:text-indigo-300">
              Terms
            </button>

            <button className="text-[13px] text-white/50 transition hover:text-indigo-300">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}