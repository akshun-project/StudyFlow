 import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SignInButton, useUser } from "@clerk/clerk-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "What exactly is StudyFlow?",
    answer:
      "StudyFlow is your all-in-one study operating system. Plan chapters with AI, take smart quizzes, prep for board exams, and watch your progress grow — all from one clean dashboard.",
    tag: "General",
  },
  {
    question: "Is StudyFlow completely free?",
    answer:
      "Yes. Daily planning, AI quizzes, streak tracking, and dashboard analytics are all free. No hidden fees, no credit card needed — just sign up and start studying.",
    tag: "Pricing",
  },
  {
    question: "How does the Coin system work?",
    answer:
      "You earn 5 Coins every time you complete a quiz. Spend those Coins to unlock AI-generated explanations for questions you got wrong. It's designed to reward consistency and make learning stick.",
    tag: "Coins",
  },
  {
    question: "Why do AI explanations require Coins?",
    answer:
      "Coins prevent misuse and help us manage AI server costs fairly. They also create a small positive loop — you study to earn, then spend to understand. It's motivation built into the design.",
    tag: "Coins",
  },
  {
    question: "What is the Board Practice Zone?",
    answer:
      "A focused space for Class 10–12 board prep. It includes English comprehension passages, case-based questions, previous year questions (PYQs), and full-book tests — all structured like real board exams.",
    tag: "Features",
  },
  {
    question: "Why does quiz generation take a few seconds?",
    answer:
      "StudyFlow generates accurate, syllabus-aligned questions fresh for each session using AI — not from a static bank. A few seconds of wait means much better questions tailored to your chapter.",
    tag: "Features",
  },
  {
    question: "Is my study data private and safe?",
    answer:
      "Absolutely. Your plans, quiz history, explanations, and streak are stored securely and are only visible to you. We use Supabase with row-level security and Clerk authentication.",
    tag: "Privacy",
  },
  {
    question: "What's coming next to StudyFlow?",
    answer:
      "We're actively building: revision flashcards, an instant doubt solver, more board test sets, and detailed subject-wise analytics. Ship updates regularly — follow along in the dashboard.",
    tag: "Roadmap",
  },
];

// ─── Tag colours ──────────────────────────────────────────────────────────────

const TAG_STYLE = {
  General:  "bg-slate-100 text-slate-500",
  Pricing:  "bg-emerald-50 text-emerald-600",
  Coins:    "bg-amber-50 text-amber-600",
  Features: "bg-indigo-50 text-indigo-600",
  Privacy:  "bg-sky-50 text-sky-600",
  Roadmap:  "bg-violet-50 text-violet-600",
};

// ─── Animation variants ───────────────────────────────────────────────────────

const headingVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Single FAQ item ──────────────────────────────────────────────────────────

function FaqItem({ faq, index, openIndex, setOpenIndex }) {
  const isOpen = openIndex === index;

  return (
    <motion.div variants={itemVariants}>
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        aria-expanded={isOpen}
        className={`w-full text-left group transition-all duration-200 rounded-2xl border bg-white ${
          isOpen
            ? "border-indigo-200 shadow-md shadow-indigo-50"
            : "border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
        }`}
        style={{ boxShadow: isOpen ? "0 4px 20px rgba(99,102,241,0.08)" : undefined }}
      >
        {/* Question row */}
        <div className="flex items-center gap-4 px-5 py-4">
          {/* Index number */}
          <span
            className={`flex-shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
              isOpen
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Question */}
          <span className={`flex-1 text-sm sm:text-base font-semibold leading-snug transition-colors ${isOpen ? "text-indigo-700" : "text-slate-800"}`}>
            {faq.question}
          </span>

          {/* Tag (hidden on mobile) */}
          <span className={`hidden sm:inline-flex flex-shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${TAG_STYLE[faq.tag]}`}>
            {faq.tag}
          </span>

          {/* Chevron */}
          <span
            className={`flex-shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? "border-indigo-200 bg-indigo-50 rotate-180"
                : "border-slate-200 bg-white group-hover:border-indigo-200 group-hover:bg-indigo-50"
            }`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-colors ${isOpen ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`}
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {/* Answer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pl-16">
                <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Faq() {
  const [openIndex, setOpenIndex] = React.useState(0); // first open by default
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <section
      id="faq"
      className="relative bg-[#F8F7FF] py-24 px-5 overflow-hidden"
    >
      {/* Background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 15% 40%, rgba(99,102,241,0.07) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 85% 70%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto">

        {/* ── Section header ──────────────────────────────────────────── */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Got questions?
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            Everything you{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              need to know.
            </span>
          </h2>

          <p className="mt-4 text-slate-500 text-base max-w-md mx-auto leading-relaxed">
            Clear answers to the most common questions about StudyFlow.
          </p>
        </motion.div>

        {/* ── FAQ list ────────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-col gap-3"
        >
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              index={index}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}