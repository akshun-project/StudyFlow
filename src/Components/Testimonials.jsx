 import React from "react";

// ---------------------- Data ----------------------
const testimonials = [
    {
    name: "Rohan Verma",
    handle: "@rohanverma",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Rohan%20Verma",
    text: "The AI study planner finally fixed my study routine. It tells me exactly what chapter to study daily.",
  },
  {
    name: "Aditya Singh",
    handle: "@adityasingh",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Aditya%Singh",
    text: "The AI quizzes are super accurate. Chapterwise tests helped me double my accuracy in just a few days.",
  },
  {
    name: "Meera Sharma",
    handle: "@meerasharma",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Meera%20Sharma",
    text: "Board Practice Zone is too good. The English passages and PYQs feel exactly like real board exam questions.",
  },
  {
    name: "Karan Thakur",
    handle: "@karanthakur",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Karan%20Thakur",
    text: "The dashboard is the best. My coins, streak, accuracy, quiz history — everything is organized and easy to track.",
  },
  {
    name: "Rishabh Rawat",
    handle: "@rishabhrawat",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Rishabh%20Rawat",
    text: "I love the coin system! Unlocking explanations using coins makes learning more fun and meaningful.",
  },
  {
    name: "Ananya Gupta",
    handle: "@ananyagupta",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Ananya%20Gupta",
    text: "StudyFlow streak keeps me motivated. I completed 12 days without a break — first time ever!",
  },
  {
    name: "Prachi Singhal",
    handle: "@prachisinghal",
    avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Prachi%20Singhal",
    text: "The best part is everything is connected — plans, quizzes, accuracy, progress. Makes studying simple.",
  },
];

// ---------------------- Card ----------------------
const TestimonialCard = ({ card }) => (
  <div className="rounded-xl mx-2 sm:mx-4 w-64 sm:w-72 shrink-0 p-[1px] bg-gradient-to-br from-indigo-100 to-purple-100 shadow-md">
    <div className="p-4 bg-white rounded-xl">
      <div className="flex gap-3 items-center">
        <img
          src={card.avatar}
          className="size-12 rounded-full border border-indigo-100"
        />
        <div>
          <p className="font-semibold text-slate-900">{card.name}</p>
          <p className="text-xs text-slate-500">{card.handle}</p>
        </div>
      </div>

      <p className="text-sm text-slate-700 leading-relaxed py-4">{card.text}</p>
      <p className="text-xs text-slate-500">✔ Verified StudyFlow Student</p>
    </div>
  </div>
);

// ---------------------- Main Section ----------------------
export default function SingleRowTestimonials() {
  return (
    <div className="relative py-20 px-4 bg-gradient-to-b from-white to-indigo-50/40 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[60%] h-60 bg-indigo-200/20 blur-[80px] -z-10" />

      {/* Animation CSS */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee {
          animation: marqueeScroll 25s linear infinite;
          display: flex;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-12">
        <p className="uppercase tracking-wide text-indigo-600 font-medium text-sm">
          Trusted by Students
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mt-1">
          What Students Say
        </h2>

        <div className="mx-auto h-[2px] w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full my-4" />

        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
          Real feedback. Real improvements. See how StudyFlow helps students stay consistent and score higher.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-auto h-[2px] w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mt-3" />

      {/* Soft Glass Container */}
      <div className="max-w-6xl mx-auto px-4 py-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-md border border-white/40 relative overflow-hidden mt-10">
        
        {/* Fades on both sides */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-indigo-50/70 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-indigo-50/70 to-transparent pointer-events-none"></div>

        {/* FIXED: Single Scrolling Row */}
        <div className="marquee w-max py-4">
          {[...testimonials, ...testimonials].map((card, index) => (
            <TestimonialCard key={index} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
