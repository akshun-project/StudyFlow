import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

import { supabase } from "../Supabase/supabaseClient";

import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
  },

  {
    path: "/planner",
    label: "Planner",
  },

  {
    path: "/quiz",
    label: "Quiz",
  },

  {
    path: "/dashboard",
    label: "Dashboard",
  },

  {
    path: "/board-practice",
    label: "Practice",
  },
];

export default function Navbar() {
  const [coins, setCoins] = useState(0);

  const [menuOpen, setMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const { isSignedIn, user } = useUser();

  const location = useLocation();

  // FETCH COINS
  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function fetchCoins() {
      const { data } = await supabase
        .from("coins")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setCoins(data.balance || 0);
      }
    }

    fetchCoins();
  }, [isSignedIn, user]);

  // SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // CLOSE MENU ON ROUTE CHANGE
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-black/5 bg-white/80 backdrop-blur-2xl"
            : "bg-white/60 backdrop-blur-2xl"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-10">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <span className=" text-[22px] font-semibold tracking-[-0.03em] sm:text-[24px] font-semibold tracking-tight sm:text-[19px]">
              <span className="text-black">Study</span>

              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Flow
              </span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <ul className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`relative text-[14px] transition-colors duration-200 ${
                      active
                        ? "font-medium text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {item.label}

                    {active && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* COINS */}
            {isSignedIn && (
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  y: -2,
                }}
                className="flex items-center gap-2 rounded-full border border-amber-100 bg-gradient-to-br from-amber-50 to-white px-3 py-1.5 shadow-sm"
              >
                {/* ICON */}
                <motion.div
                  animate={{
                    rotate: [0, -8, 8, -4, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 6,
                    ease: "easeInOut",
                  }}
                  className="text-[13px]"
                >
                  ⚡
                </motion.div>

                {/* NUMBER */}
                <motion.span
                  key={coins}
                  initial={{
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="text-[13px] font-semibold text-amber-700"
                >
                  {coins}
                </motion.span>
              </motion.div>
            )}

            {/* DESKTOP AUTH */}
            {!isSignedIn ? (
              <div className="hidden items-center gap-3 md:flex">
                <SignInButton mode="modal">
                  <button className="text-[14px] font-medium text-gray-600 transition hover:text-black">
                    Log in
                  </button>
                </SignInButton>

                <SignInButton mode="modal">
                  <button className="rounded-2xl bg-black px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg active:scale-[0.98]">
                    Start free
                  </button>
                </SignInButton>
              </div>
            ) : (
              <div className="hidden md:block">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 ring-2 ring-white shadow-md",
                    },
                  }}
                />
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <motion.button
              whileTap={{
                scale: 0.92,
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-black/5 bg-white shadow-sm md:hidden"
            >
              {/* TOP */}
              <motion.span
                animate={
                  menuOpen
                    ? {
                        rotate: 45,
                        y: 0,
                      }
                    : {
                        rotate: 0,
                        y: -4,
                      }
                }
                transition={{
                  duration: 0.25,
                }}
                className="absolute h-[2px] w-5 rounded-full bg-black"
              />

              {/* MIDDLE */}
              <motion.span
                animate={
                  menuOpen
                    ? {
                        opacity: 0,
                      }
                    : {
                        opacity: 1,
                      }
                }
                transition={{
                  duration: 0.2,
                }}
                className="absolute h-[2px] w-5 rounded-full bg-black"
              />

              {/* BOTTOM */}
              <motion.span
                animate={
                  menuOpen
                    ? {
                        rotate: -45,
                        y: 0,
                      }
                    : {
                        rotate: 0,
                        y: 4,
                      }
                }
                transition={{
                  duration: 0.25,
                }}
                className="absolute h-[2px] w-5 rounded-full bg-black"
              />
            </motion.button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />

            {/* MENU */}
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed left-0 top-[72px] z-50 w-full border-t border-black/5 bg-white/95 backdrop-blur-2xl md:hidden"
            >
              <div className="px-5 py-6">
                {/* USER */}
                {isSignedIn && (
                  <div className="mb-5 flex items-center justify-between rounded-3xl border border-black/5 bg-[#F8F9FC] p-4">
                    {/* LEFT */}
                    <div className="flex items-center gap-3">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "h-11 w-11",
                          },
                        }}
                      />

                      <div>
                        <p className="text-sm font-semibold text-black">
                          {user?.firstName || "Student"}
                        </p>

                        <p className="text-[12px] text-gray-400">
                          Welcome back 👋
                        </p>
                      </div>
                    </div>

                    {/* COINS */}
                    <motion.div
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="flex items-center gap-2 rounded-full border border-amber-100 bg-gradient-to-br from-amber-50 to-white px-3 py-1.5"
                    >
                      <span className="text-[13px]">⚡</span>

                      <span className="text-[13px] font-semibold text-amber-700">
                        {coins}
                      </span>
                    </motion.div>
                  </div>
                )}

                {/* NAV */}
                <motion.ul className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item, index) => (
                    <motion.li
                      key={item.path}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center justify-between rounded-2xl px-4 py-4 text-[15px] font-medium transition-all duration-200 ${
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-100"
                            : "bg-[#F8F9FC] text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}

                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                        >
                          <path
                            d="M2 7.5H13M13 7.5L8 2.5M13 7.5L8 12.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>

                {/* MOBILE BUTTON */}
                {!isSignedIn && (
                  <div className="mt-5 border-t border-black/5 pt-5">
                    <SignInButton mode="modal">
                      <button className="w-full rounded-2xl bg-black py-3.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]">
                        Start studying free
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
