import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { supabase } from "../Supabase/supabaseClient";  

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coins, setCoins] = useState(0);

  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  // ✅ Fetch coins from Supabase
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

  return (
    <div className="bg-[url(https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBackground.png)] text-sm text-gray-500">
      {/* ✅ Navbar */}
      {/* ✅ NAVBAR FIXED */}
      <nav className="flex items-center justify-between px-5 md:px-16 lg:px-24 xl:px-32 py-6 border-b border-gray-300 font-medium relative z-10 bg-white/80 backdrop-blur-md">
        {/* ✅ LEFT — LOGO */}
        <Link to="/" className="font-bold text-2xl text-indigo-700">
          StudyFlow
        </Link>

        {/* ✅ CENTER — DESKTOP MENU */}
        <ul className="hidden md:flex gap-10 text-[1vw] font-medium">
          <li>
            <Link className="hover:text-indigo-600" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-indigo-600" to="/planner">
              Planner
            </Link>
          </li>
          <li>
            <Link className="hover:text-indigo-600" to="/quiz">
              Quiz
            </Link>
          </li>
          <li>
            <Link className="hover:text-indigo-600" to="/dashboard">
              Dashboard
            </Link>
          </li>
        </ul>

        {/* ✅ RIGHT — COINS + LOGIN + HAMBURGER */}
        <div className="flex items-center gap-7">
          {/* ✅ Coins ALWAYS visible (desktop + mobile) */}
          {isSignedIn && (
            <div className="flex items-center gap-1 bg-yellow-100 px-3  rounded-full border border-yellow-300">
              <span className="text-yellow-700 text-sm font-semibold">
                {coins}
              </span>
              <span className="text-yellow-600 text-lg">🪙</span>
            </div>
          )}

          {/*  Desktop Login / Avatar */}
          <div className="hidden md:block">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="px-5 py-2 border rounded-md hover:bg-indigo-50">
                  Log In
                </button>
              </SignInButton>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>

          {/*  Hamburger (Mobile Only) */}
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
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/*  Mobile Menu (opens BELOW navbar) */}
        {menuOpen && (
          <ul className="md:hidden absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-6 text-base px-6 py-6 z-50">
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/planner" onClick={() => setMenuOpen(false)}>
                Planner
              </Link>
            </li>
            <li>
              <Link to="/quiz" onClick={() => setMenuOpen(false)}>
                Quiz
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
            </li>

            {/* ✅ Mobile Login / Avatar */}
            <div className="mt-4">
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="px-4 py-2 border rounded-md hover:bg-indigo-50">
                    Log In
                  </button>
                </SignInButton>
              ) : (
                <UserButton afterSignOutUrl="/" />
              )}
            </div>
          </ul>
        )}
      </nav>

      {/* ✅ Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center px-4 text-center relative">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-9 border border-gray-500/30 rounded-full bg-gray-300/15 pl-4 p-1 text-sm text-gray-800 max-w-full">
          <p>Make your study plan today!</p>
          <div
            onClick={() => navigate("/planner")}
            className="flex items-center cursor-pointer gap-2 bg-white border border-gray-500/30 rounded-2xl px-3 py-1 whitespace-nowrap"
          >
            <p>Explore</p>
            <svg
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4.5h10.182m-4-3.5 4 3.5-4 3.5"
                stroke="#6B7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold max-w-4xl text-gray-800">
          Plan. Learn. Quiz. Maintain Your Study Streak
        </h1>

        <p className="max-w-xl text-center mt-8 px-4 text-gray-900">
          Build your daily study schedule, take quizzes anytime, and track your
          progress effortlessly with StudyFlow.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={() => navigate("/quiz")}
            className="px-7 py-3 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Take Quiz Now
          </button>

          <button
            onClick={() => navigate("/faq")}
            className="group px-7 py-2.5 flex items-center gap-2 font-medium"
          >
            Learn More
            <svg
              className="group-hover:translate-x-1 transition pt-0.5"
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4.5h10.182m-4-3.5 4 3.5-4 3.5"
                stroke="#6B7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
