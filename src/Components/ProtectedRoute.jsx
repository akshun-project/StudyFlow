 // src/components/ProtectedRoute.jsx
import { useUser, SignInButton } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div className="text-center mt-20">Loading...</div>;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Please log in to access this page.
        </h2>
        <SignInButton mode="modal">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Log In
          </button>
        </SignInButton>
      </div>
    );
  }

  return children;
}

