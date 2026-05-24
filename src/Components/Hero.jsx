 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../Components/Navbar";

function Counter({ from = 0, to, suffix = "" }) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    let start = from;

    const duration = 1800;
    const increment = to / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= to) {
        start = to;
        clearInterval(timer);
      }

      setValue(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [from, to]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },

    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <main className="relative overflow-hidden bg-[#F7F8FA] text-[#111827]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        {/* MAIN BLUR */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-0 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl sm:h-[500px] sm:w-[700px]"
        />

        {/* SECOND BLUR */}
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-40 h-[220px] w-[220px] rounded-full bg-violet-100/40 blur-3xl sm:h-[300px] sm:w-[300px]"
        />
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:flex-row lg:items-center lg:gap-20 lg:px-10">

        {/* LEFT */}
        <div className="flex-1">

          {/* BADGE */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 shadow-sm"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-[13px] font-medium text-gray-600">
              Trusted by 150+ students
            </span>
          </motion.div>

          {/* HEADING */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="max-w-[320px] text-[36px] font-semibold leading-[1.02] tracking-tight text-black sm:max-w-3xl sm:text-6xl lg:text-7xl"
          >
            Build a study routine
            <span className="text-gray-400">
              {" "}you’ll actually follow.
            </span>
          </motion.h1>

          {/* DESCRIPTION */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-6 max-w-xl text-[15px] leading-7 text-gray-500 sm:text-lg sm:leading-8"
          >
            StudyFlow helps students plan sessions,
            practice smarter, track consistency,
            and stay focused without feeling overwhelmed.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={() => navigate("/planner")}
              className="rounded-2xl bg-black px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.98]"
            >
              Start studying
            </button>

            <button
              onClick={() => {
                const section =
                  document.getElementById("features");

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
              className="rounded-2xl border border-black/5 bg-white/70 px-7 py-4 text-sm font-medium text-gray-700 backdrop-blur transition-all duration-300 hover:bg-white"
            >
              Explore platform
            </button>
          </motion.div>

          {/* STATS */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-12 grid grid-cols-3 gap-3 sm:mt-14 sm:flex sm:flex-wrap sm:items-center sm:gap-10"
          >
            <div>
              <p className="text-xl font-semibold sm:text-3xl">
                <Counter to={190} suffix="+" />
              </p>

              <p className="mt-1 text-[11px] text-gray-500 sm:text-sm">
                active students
              </p>
            </div>

            <div>
              <p className="text-xl font-semibold sm:text-3xl">
                <Counter to={10} suffix="k+" />
              </p>

              <p className="mt-1 text-[11px] text-gray-500 sm:text-sm">
                quizzes completed
              </p>
            </div>

            <div>
              <p className="text-xl font-semibold sm:text-3xl">
                <Counter to={92} suffix="%" />
              </p>

              <p className="mt-1 text-[11px] text-gray-500 sm:text-sm">
                weekly consistency
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="relative mt-12 mx-auto w-full max-w-[340px] flex-1 sm:mt-16 sm:max-w-none lg:mt-0"
        >

          {/* FLOATING CARD */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-5 right-3 z-20 hidden rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-xl lg:block"
          >
            <p className="text-xs text-gray-400">
              Weekly consistency
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-2xl font-semibold">
                92%
              </span>

              <span className="text-sm text-emerald-600">
                +12%
              </span>
            </div>
          </motion.div>

          {/* MAIN CARD */}
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              y: -3,
            }}
            className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] sm:rounded-[30px]"
          >

            {/* TOP BAR */}
            <div className="flex items-center gap-2 border-b border-black/5 px-4 py-3 sm:px-5 sm:py-4">
              <div className="h-3 w-3 rounded-full bg-red-300" />

              <div className="h-3 w-3 rounded-full bg-yellow-300" />

              <div className="h-3 w-3 rounded-full bg-green-300" />
            </div>

            {/* CONTENT */}
            <div className="grid gap-2.5 p-3.5 sm:gap-4 sm:p-5">

              {/* TOP GRID */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">

                {/* STREAK */}
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-2xl border border-black/5 bg-[#F9FAFB] p-3 sm:p-4"
                >
                  <p className="text-[9px] uppercase tracking-wide text-gray-400 sm:text-xs">
                    Streak
                  </p>

                  <h3 className="mt-2 text-xl font-semibold sm:mt-3 sm:text-3xl">
                    14
                  </h3>

                  <p className="mt-1 text-[10px] text-gray-500 sm:text-sm">
                    days active
                  </p>
                </motion.div>

                {/* PROGRESS */}
                <div className="col-span-2 rounded-2xl border border-black/5 bg-[#F9FAFB] p-3 sm:p-4">

                  <div className="flex items-center justify-between">

                    <p className="text-[9px] uppercase tracking-wide text-gray-400 sm:text-xs">
                      Weekly Progress
                    </p>

                    <p className="text-[10px] text-emerald-600 sm:text-sm">
                      +18%
                    </p>
                  </div>

                  {/* CHART */}
                  <div className="mt-4 flex items-end gap-1.5 sm:mt-6 sm:gap-2">
                    {[35, 55, 40, 75, 60, 90, 72].map(
                      (height, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            height: 0,
                          }}
                          animate={{
                            height,
                          }}
                          transition={{
                            duration: 0.7,
                            delay: i * 0.08,
                          }}
                          className="flex-1 rounded-full bg-gradient-to-t from-indigo-600 to-violet-500"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* TASKS */}
              <div className="rounded-2xl border border-black/5 bg-[#F9FAFB] p-4 sm:p-5">

                <div className="flex items-center justify-between">

                  <h3 className="text-[13px] font-medium sm:text-sm">
                    Today's Study Plan
                  </h3>

                  <span className="text-[10px] text-gray-400 sm:text-sm">
                    3 tasks
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2.5 sm:gap-3">

                  {[
                    {
                      title: "Physics Revision",
                      time: "7:00 PM",
                      completed: true,
                    },

                    {
                      title: "Math Mock Test",
                      time: "8:30 PM",
                    },

                    {
                      title: "Chemistry Quiz",
                      time: "10:00 PM",
                    },
                  ].map((task, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: i * 0.12,
                      }}
                      className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-3 py-2.5 sm:px-4 sm:py-3"
                    >
                      <div className="flex items-center gap-3">

                        {/* CHECK */}
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            task.completed
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {task.completed && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                            >
                              <path
                                d="M1 5L4 8L9 2"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* TEXT */}
                        <div>
                          <p
                            className={`text-[12px] font-medium sm:text-sm ${
                              task.completed
                                ? "text-gray-400 line-through"
                                : "text-black"
                            }`}
                          >
                            {task.title}
                          </p>

                          <p className="text-[10px] text-gray-400 sm:text-xs">
                            {task.time}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] text-gray-400 sm:text-xs">
                        45 min
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}