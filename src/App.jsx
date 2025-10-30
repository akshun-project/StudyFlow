 import { Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import Planner from "./Components/Planner";
import Quiz from "./Components/Quiz";
import Dashboard from "./Components/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

// Landing page sections
import Features from "./Components/Features";
import Faq from "./Components/Faq";
import Footer from "./Components/Footer";

// ✅ Sync user
import SyncUserToSupabase from "./Clerk/SyncUserToSupabase";

function App() {
  return (
    <>
      <SyncUserToSupabase />

      <Routes>
        {/* ✅ Landing page = All sections together */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Features />
              <Faq />
              <Footer />
            </>
          }
        />

        {/* ✅ Protected pages */}


          <Route

        
          path="faq"
          element={
            
              <Faq />
    
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
