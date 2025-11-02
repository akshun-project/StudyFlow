import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useUser(); // check if user is signed in
  const navigate = useNavigate();

  return (
    <div className="bg-[url(https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBackground.png)] text-sm text-gray-500">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-5 md:px-16 lg:px-24 xl:px-32 py-6 border-b border-gray-300 font-medium relative z-10 bg-white/80 backdrop-blur-md">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl text-indigo-700">
          StudyFlow
        </Link>

        {/* Hamburger (Mobile) */}
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
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Nav Links */}
        <ul
          className={`${
            menuOpen ? "flex" : "hidden"
          } max-md:absolute top-full left-0 max-md:w-full md:flex md:items-center gap-8 max-md:bg-white max-md:shadow-md max-md:px-6 max-md:py-4 flex-col md:flex-row z-50`}
        >
          <li>
            <Link
              className="hover:text-indigo-500 md:hover:underline underline-offset-8 transition text-base md:text-[1vw] font-medium"
              to="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-indigo-500 md:hover:underline underline-offset-8 transition text-base md:text-[1vw] font-medium"
              to="/planner"
            >
              Planner
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-indigo-500 md:hover:underline underline-offset-8 transition text-base md:text-[1vw] font-medium"
              to="/quiz"
            >
              Quiz
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-indigo-500 md:hover:underline underline-offset-8 transition text-base md:text-[1vw] font-medium"
              to="/dashboard"
            >
              Dashboard
            </Link>
          </li>

          {/* Mobile: Login / Avatar */}
          <li className="block md:hidden mt-4">
            {!isSignedIn ? (
              <SignInButton mode="modal">
                <button className="group flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-indigo-50">
                  Log In
                </button>
              </SignInButton>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </li>
        </ul>

        {/* Desktop: Login / Avatar */}
        <div className="hidden md:flex items-center">
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="group flex items-center gap-2 px-5 py-2 text-base border rounded-md hover:bg-indigo-50">
                Log In
              </button>
            </SignInButton>
          ) : (
            <UserButton redirectUrl="/" />
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center px-4 text-center relative">
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-9 border border-gray-500/30 rounded-full bg-gray-300/15 pl-4 p-1 text-sm text-gray-800 max-w-full">
          <p>Start your study streak today!</p>
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
          Build your daily study schedule, take quizzes anytime, and
          track your progress effortlessly with StudyFlow.
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
