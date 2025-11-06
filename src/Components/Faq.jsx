 import React from "react";
import { motion } from "framer-motion";

const Faq = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqsData = [
    {
      question: "What is StudyFlow?",
      answer:
        "StudyFlow helps students plan their studies, take quizzes, and track progress in one place.",
    },
    {
      question: "Is StudyFlow free to use?",
      answer:
        "Yes! Planning, Quizzes, Dashboard, and Streak features are all free to use.",
    },
    {
      question: "What are Coins and how do they work?",
      answer:
        "Coins are earned by taking quizzes daily. You can use them to unlock quiz explanations.",
    },
    {
      question: "Why does quiz explanation need Coins?",
      answer:
        "Coins prevent misuse and keep systems stable. It also motivates students to stay active.",
    },
    {
      question: "Why does creating a quiz or plan take 15–20 seconds?",
      answer:
        "StudyFlow generates accurate questions and plans, which need a few seconds to process.",
    },
    {
      question: "Why does quiz generation sometimes fail?",
      answer:
        "If traffic is high, quiz creation may fail once. Just retry — it usually works immediately.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes. Your Plans, Quizzes, Coins, and Progress are stored securely and only accessible to you.",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto flex flex-col items-center text-center text-slate-800">
      <p className="text-sm font-semibold uppercase text-indigo-600 tracking-wider">
        FAQ
      </p>
      <h1 className="text-2xl md:text-5xl font-semibold mt-2 leading-tight">
        Frequently Asked Questions
      </h1>
      <p className="text-sm text-slate-600 mt-3 max-w-sm">
        Quick answers to help you understand StudyFlow better.
      </p>

      <div className="max-w-xl w-full mt-8 flex flex-col gap-4 items-start text-left">
        {faqsData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-start w-full"
          >
            <div
              className="flex items-center justify-between w-full cursor-pointer bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-4 rounded-lg hover:shadow-md hover:border-indigo-200 transition-all"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
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

            <p
              className={`text-sm text-slate-500 px-4 transition-all duration-500 ease-in-out overflow-hidden ${
                openIndex === index
                  ? "opacity-100 max-h-[300px] pt-4"
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
