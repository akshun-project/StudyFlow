 import React from "react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Rohan Verma",
    initials: "RV",
    class: "Class 12",
    review:
      "The study planner finally fixed my routine. Now I know exactly what to study every day.",
  },
  {
    name: "Meera Singhal",
    initials: "MS",
    class: "Class 10",
    review:
      "Board Practice helped me a lot in English. The questions feel like real exams.",
  },
  {
    name: "Aditya Singh",
    initials: "AS",
    class: "Class 11",
    review:
      "The quizzes are actually useful. My accuracy improved a lot after daily practice.",
  },
  {
    name: "Ananya Gupta",
    initials: "AG",
    class: "Class 9",
    review:
      "The streak system keeps me motivated. I studied consistently for the first time.",
  },
  {
    name: "Karan Thakur",
    initials: "KT",
    class: "Class 12",
    review:
      "Dashboard is super clean. I can track my quizzes, coins, and progress easily.",
  },
  {
    name: "Prachi Sharma",
    initials: "PS",
    class: "Class 11",
    review:
      "Everything feels connected — planner, quizzes, streaks, and progress tracking.",
  },
];

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

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="#F59E0B"
        >
          <path d="M6 1l1.236 2.506 2.764.402-2 1.948.472 2.752L6 7.506l-2.472 1.102L4 5.856 2 3.908l2.764-.402z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
      }}
      className="mx-2 w-[260px] sm:w-[300px] shrink-0 rounded-[24px] border border-black/5 bg-white p-5"
      style={{
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* TOP */}
      <div className="flex items-center justify-between">

        {/* USER */}
        <div className="flex items-center gap-3">

          {/* INITIALS */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-[#F7F8FA] text-[13px] font-semibold text-black">
            {item.initials}
          </div>

          {/* NAME */}
          <div>
            <p className="text-sm font-semibold text-black">
              {item.name}
            </p>

            <p className="text-[11px] text-gray-400">
              {item.class}
            </p>
          </div>
        </div>

        {/* STARS */}
        <Stars />
      </div>

      {/* REVIEW */}
      <p className="mt-4 text-sm leading-7 text-gray-600">
        “{item.review}”
      </p>
    </motion.div>
  );
}

function Marquee({ items }) {
  const duplicated = [...items, ...items];

  return (
    <div className="relative overflow-hidden">

      {/* LEFT FADE */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-24"
        style={{
          background:
            "linear-gradient(to right, #F7F8FA, transparent)",
        }}
      />

      {/* RIGHT FADE */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-24"
        style={{
          background:
            "linear-gradient(to left, #F7F8FA, transparent)",
        }}
      />

      {/* MOVING ROW */}
      <motion.div
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex w-max py-2"
      >
        {duplicated.map((item, index) => (
          <TestimonialCard
            key={index}
            item={item}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#F7F8FA] py-16 sm:py-20"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-5">

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
            <div className="h-2 w-2 rounded-full bg-black" />

            <span className="text-[13px] text-gray-600">
              Student reviews
            </span>
          </div>

          {/* HEADING */}
          <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl">
            Built for students.
            <span className="text-gray-400">
              {" "}Trusted by students.
            </span>
          </h2>

          {/* DESCRIPTION */}
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base leading-7 text-gray-500">
            Real feedback from students using StudyFlow
            every day to stay consistent and improve.
          </p>
        </motion.div>
      </div>

      {/* TESTIMONIALS */}
      <div className="mt-12">
        <Marquee items={TESTIMONIALS} />
      </div>

      {/* BOTTOM NOTE */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-10 flex items-center justify-center gap-2 text-[13px] text-gray-400"
      >
        <div className="h-2 w-2 rounded-full bg-emerald-400" />

        Verified StudyFlow students
      </motion.div>
    </section>
  );
}