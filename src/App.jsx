//  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Hero from "./Components/Hero";
// import Planner from "./Components/Planner";
// import Quiz from "./Components/Quiz";
// import  Dashboard from "./Components/Dashboard";
// import useUserSync from "./hooks/useUserSync";

// function App() {
//   // ✅ Run the user sync logic when app loads
//   useUserSync();

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Hero />} />
//         <Route path="/planner" element={<Planner />} />
//         <Route path="/quiz" element={<Quiz />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


 import { Routes, Route } from "react-router-dom";
import Hero from "./Components/Hero";
import Planner from "./Components/Planner";
import Quiz from "./Components/Quiz";
import Dashboard from "./Components/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

// ✅ Import sync component
import SyncUserToSupabase from "./Clerk/SyncUserToSupabase";

function App() {
  return (
    <>
    
      <SyncUserToSupabase />

      <Routes>
        <Route path="/" element={<Hero />} />

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

// new 