import React from "react";

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
      question: "Why does creating a quiz or plan take 20–25 seconds?",
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
    <div className="flex flex-col items-center text-center text-slate-800 px-3 py-12">
      {/* Header */}
      <p className="text-base font-medium text-indigo-600">FAQ</p>
      <h1 className="text-3xl md:text-4xl font-semibold mt-2">
        Frequently Asked Questions
      </h1>
      <p className="text-sm text-slate-500 mt-4 max-w-sm">
        Quick answers to help you understand StudyFlow better.
      </p>

      {/* FAQ List */}
      <div className="max-w-xl w-full mt-8 flex flex-col gap-4 items-start text-left">
        {faqsData.map((faq, index) => (
          <div key={index} className="flex flex-col items-start w-full">
            {/* Question Box */}
            <div
              className="flex items-center justify-between w-full cursor-pointer bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-4 rounded-lg"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <h2 className="text-sm font-medium">{faq.question}</h2>

              {/* Icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`${
                  openIndex === index ? "rotate-180" : ""
                } transition-all duration-500 ease-in-out`}
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
              className={`text-sm text-slate-500 px-4 transition-all duration-500 ease-in-out overflow-hidden ${
                openIndex === index
                  ? "opacity-100 max-h-[300px] pt-4"
                  : "opacity-0 max-h-0"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
