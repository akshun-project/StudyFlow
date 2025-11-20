 import React from "react";
import { motion } from "framer-motion";

const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqsData = [
    {
      question: "What is StudyFlow?",
      answer:
        "StudyFlow is a smart study companion that helps you plan your chapters, take AI quizzes, prepare for board exams, and track your progress in one place.",
    },
    {
      question: "Is StudyFlow free?",
      answer:
        "Yes! Daily study planning, quizzes, dashboard analytics, and streak are free for all students.",
    },
    {
      question: "What are Coins and how do they work?",
      answer:
        "You earn 5 Coins for completing quizzes. Use Coins to unlock premium quiz explanations and improve conceptual clarity.",
    },
    {
      question: "Why do quiz explanations require Coins?",
      answer:
        "To prevent misuse, ensure fair use, and manage server load. Coins also motivate you to stay active every day.",
    },
    {
      question: "What is the Board Practice Zone?",
      answer:
        "It includes English passages, case-based questions, PYQs, and full-book tests — everything designed for Class 9–10 board exam preparation.",
    },
    {
      question: "Why does generating a quiz or plan take 15–20 seconds?",
      answer:
        "StudyFlow creates high-quality content using AI. Accurate questions/plans take a few seconds to generate.",
    },
    {
      question: "Why does quiz generation fail sometimes?",
      answer:
        "When many students are using it at the same time. Simply retry — it usually works instantly on the second try.",
    },
    {
      question: "Is my study data safe?",
      answer:
        "Yes. All your plans, quizzes, explanations, streak, and progress are stored securely and visible only to you.",
    },
    {
      question: "Will StudyFlow add more features?",
      answer:
        "Yes! More board tests, AI revision notes, and a flashcard system are coming soon.",
    },
  ];

  return (
    <section
      id="faq"
      className="min-h-screen py-24 px-6 bg-gradient-to-b from-indigo-50 to-white"
    >
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-sm font-semibold uppercase text-indigo-600 tracking-wider">
          FAQ
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h1>

        <p className="text-sm text-slate-600 mt-3">
          Clear answers to help you get the best out of StudyFlow.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-2xl mx-auto mt-12 flex flex-col gap-4">
        {faqsData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between w-full cursor-pointer bg-white border border-indigo-100 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <h2 className="text-base font-medium text-slate-800">
                {faq.question}
              </h2>

              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${
                  openIndex === index ? "rotate-180" : ""
                } transition-transform duration-500 ease-in-out`}
              >
                <path
                  d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                  stroke="#1D293D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Answer */}
            <p
              className={`text-sm text-slate-600 px-4 transition-all duration-500 ease-in-out overflow-hidden ${
                openIndex === index
                  ? "opacity-100 max-h-[300px] pt-3"
                  : "opacity-0 max-h-0"
              }`}
            >
              {faq.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
