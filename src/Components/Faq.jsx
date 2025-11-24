 import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqsData = [
    {
      question: "What is StudyFlow?",
      answer:
        "StudyFlow is a smart study companion that helps you plan chapters, take AI quizzes, prepare for boards, and track your progress — all in one place.",
    },
    {
      question: "Is StudyFlow free?",
      answer:
        "Yes! Daily planning, quizzes, streak, dashboard analytics — everything is free for all students.",
    },
    {
      question: "How do Coins work?",
      answer:
        "You earn 5 Coins for completing quizzes. Use Coins to unlock premium explanations and strengthen concepts.",
    },
    {
      question: "Why do AI explanations require Coins?",
      answer:
        "To avoid misuse and manage server load. Coins encourage consistency and fair usage.",
    },
    {
      question: "What is the Board Practice Zone?",
      answer:
        "It includes English passages, case-based questions, PYQs, and full-book tests for Class 9–10 board prep.",
    },
    {
      question: "Why does quiz generation take a few seconds?",
      answer:
        "Because StudyFlow creates accurate, syllabus-based questions using AI. High-quality questions need a few seconds.",
    },
    {
      question: "Is my study data safe?",
      answer:
        "Yes. All your data — plans, quizzes, explanations, streak — is securely stored and only visible to you.",
    },
    {
      question: "Will new features be added?",
      answer:
        "Yes! More board tests, revision notes, flashcards, and instant doubt solver features are coming soon.",
    },
  ];

  return (
    <section id="faq" className="relative py-24 px-6 bg-gradient-to-b from-white to-indigo-50/40 overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60%] h-64 bg-indigo-200/30 blur-[100px] -z-10"></div>

      {/* Section Divider from Testimonials */}
      <div className="mx-auto h-[2px] w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mb-10"></div>

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-sm font-semibold uppercase text-indigo-600 tracking-wide">
          FAQ
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h1>

        <p className="text-sm text-slate-600 mt-3">
          Clear answers to help you get the best out of StudyFlow.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-2xl mx-auto mt-8 flex flex-col gap-5">
        {faqsData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full"
          >
            {/* Card */}
            <div
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="p-[1px] rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 cursor-pointer shadow-sm hover:shadow-lg transition-all"
            >
              <div className="bg-white rounded-xl p-5 flex justify-between items-center">
                <h2 className="text-base font-semibold text-slate-800">
                  {faq.question}
                </h2>

                <ChevronDown
                  size={20}
                  className={`text-slate-700 transition-transform duration-500 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Answer */}
              <div
                className={`px-5 text-sm transition-all duration-500 overflow-hidden ${
                  openIndex === index
                    ? "max-h-[200px] opacity-100 py-4"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
