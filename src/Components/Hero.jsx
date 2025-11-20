 import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { supabase } from "../Supabase/supabaseClient";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(0);
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function fetchCoins() {
      const { data } = await supabase
        .from("coins")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (data) setCoins(data.balance || 0);
    }
    fetchCoins();
  }, [isSignedIn, user]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/planner", label: "Planner" },
    { path: "/quiz", label: "Quiz" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/board-practice", label: "Board Practice" },
  ];

  return (
    <main className="relative min-h-screen bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBackground.png')] bg-cover bg-center text-gray-700 overflow-x-hidden">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-20 bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-5 font-medium">

          {/* Logo */}
          <Link
            to="/"
            className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            StudyFlow
          </Link>

          {/* Desktop Navbar */}
          <ul className="hidden md:flex gap-10 text-base font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`relative transition-all ${
                    location.pathname === item.path
                      ? "text-indigo-700 font-semibold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-indigo-600 after:rounded-full"
                      : "hover:text-indigo-600"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Coins + Auth */}
          <div className="flex items-center gap-6">
            {isSignedIn && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300 shadow-sm"
              >
                <span className="text-yellow-700 text-sm font-semibold">
                  {coins}
                </span>
                <span className="text-yellow-600 text-lg animate-bounce">🪙</span>
              </motion.div>
            )}

            <div className="hidden md:block">
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="px-5 py-2 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-all font-medium">
                    Log In
                  </button>
                </SignInButton>
              ) : (
                <UserButton afterSignOutUrl="/" />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-5 text-base px-6 py-6 border-t border-gray-200 z-50"
            >
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-indigo-600 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <div className="mt-4">
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <button className="w-full px-4 py-2 border rounded-lg hover:bg-indigo-50 transition">
                      Log In
                    </button>
                  </SignInButton>
                ) : (
                  <UserButton afterSignOutUrl="/" />
                )}
              </div>
            </motion.ul>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 pt-24 max-w-4xl mx-auto">

        {/* Small Banner */}
       
   <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-2 mb-6 border border-gray-300/50 rounded-full bg-gray-100/40 pl-4 p-1 text-sm text-gray-800"
        >
          <p>Make your study plan today!</p>

          <button
            onClick={() => navigate("/planner")}
            className="flex items-center gap-2 bg-white border border-gray-300/70 rounded-2xl px-3 py-1 shadow-sm hover:shadow-md transition"
          >
            <p>Explore</p>
            <svg width="12" height="9" fill="none" stroke="#6B7280" strokeWidth="1.5">
              <path d="M1 4.5h10.182m-4-3.5 4 3.5-4 3.5" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-4xl text-gray-800 leading-tight"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Plan. Learn. Quiz.
          </span>{" "}
          Build Your Study Flow.
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="max-w-lg mt-10 text-gray-600 text-base md:text-lg leading-relaxed"
        >
          Stay consistent, study smarter, and feel proud of your progress with StudyFlow.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          {/* Smooth Scroll Button */}
          <button
            onClick={() => {
              const target = document.getElementById("features");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition transform text-white font-semibold shadow-md hover:shadow-lg"
          >
            Start Learning
          </button>

          <button
            onClick={() => {
              const target = document.getElementById("faq");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            className="group px-7 py-2.5 flex items-center gap-2 font-medium text-gray-700 hover:text-indigo-600 transition"
          >
            Learn More
            <svg
              className="group-hover:translate-x-1 transition pt-0.5"
              width="12"
              height="9"
              fill="none"
              stroke="#6B7280"
              strokeWidth="1.5"
            >
              <path d="M1 4.5h10.182m-4-3.5 4 3.5-4 3.5" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      </section>
    </main>
  );
}



 



 
      
