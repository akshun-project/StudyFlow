 import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function useUserSync() {
  const { user } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;

      try {
        // Prepare Clerk user data
        const userData = {
          id: user.id, // ✅ Clerk user ID (e.g. "user_abc123")
          name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.primaryEmailAddress?.emailAddress || "",
        };

        // Insert or update user in Supabase
        const { error } = await supabase.from("users").upsert(userData);

        if (error) {
          console.error("❌ Supabase user sync failed:", error);
        } else {
          console.log("✅ Supabase user synced successfully:", userData);
        }
      } catch (err) {
        console.error("⚠️ Unexpected sync error:", err);
      }
    };

    syncUser();
  }, [user]);
}
