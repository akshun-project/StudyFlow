//  import React from "react";
// import { createRoot } from "react-dom/client";
// import { ClerkProvider } from "@clerk/clerk-react";
// import App from "./App";
// import "./index.css";

// // Replace with your Clerk Publishable Key
//  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ClerkProvider publishableKey={clerkPubKey}>
//       <App />
//     </ClerkProvider>
//   </React.StrictMode>
// );

 import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";   // ✅ Add this
import App from "./App";
import "./index.css";

// Replace with your Clerk Publishable Key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>             {/* ✅ Must wrap App */}
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);


