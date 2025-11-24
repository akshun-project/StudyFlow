 import { Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import Planner from "./Components/Planner";
import Quiz from "./Components/Quiz";
import Dashboard from "./Components/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Testimonials from "./Components/Testimonials";

// Landing page sections
import Features from "./Components/Features";
import Faq from "./Components/Faq";
import Footer from "./Components/Footer";

// Sync user
import SyncUserToSupabase from "./Clerk/SyncUserToSupabase";

// Add this
import QuizExplain from "./Components/QuizExplain";

// ⭐ Board Practice
import BoardPractice from "./Components/BoardPractice";

function App() {
  return (
    <>
      <SyncUserToSupabase />

      <Routes>
        {/* Landing page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <Testimonials />
              <Faq />
              <Footer />
            </>
          }
        />

        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <Planner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz-explain/:quizId"
          element={
            <ProtectedRoute>
              <QuizExplain />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ⭐ Board Practice Route */}
        <Route
          path="/board-practice"
          element={
            <ProtectedRoute>
              <BoardPractice />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
