import { useUser } from "@clerk/clerk-react";
import { supabase } from "../Supabase/supabaseClient";
import { useEffect } from "react";

export default function SyncUserToSupabase() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const saveUser = async () => {
      await supabase
        .from("users")
        .upsert(
          {
            id: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
          },
          { onConflict: "id" }
        );
    };

    saveUser();
  }, [user]);

  return null;
}
