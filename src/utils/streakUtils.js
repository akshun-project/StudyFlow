import { supabase } from "../Supabase/supabaseClient";

// Format as YYYY-MM-DD
const today = () => new Date().toISOString().split("T")[0];

export async function updateStreak(userId) {
  const todayDate = today();

  // 1️⃣ Fetch existing streak
  const { data: streakRow, error: fetchError } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Streak fetch error:", fetchError);
    return;
  }

  // 2️⃣ If no row → first streak
  if (!streakRow) {
    const { error: insertError } = await supabase.from("streaks").insert([
      {
        user_id: userId,
        last_active: todayDate,
        current_streak: 1,
      },
    ]);

    if (insertError) console.error("Streak insert error:", insertError);
    return;
  }

  // Existing streak found
  const lastActive = streakRow.last_active;
  const currentStreak = streakRow.current_streak;

  // 3️⃣ If streak already counted today → do nothing
  if (lastActive === todayDate) {
    return;
  }

  // 4️⃣ Check if yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().split("T")[0];

  let newStreak = 1;

  if (lastActive === yesterdayDate) {
    // Continue streak
    newStreak = currentStreak + 1;
  } else {
    // Reset streak
    newStreak = 1;
  }

  // 5️⃣ Update streak
  const { error: updateError } = await supabase
    .from("streaks")
    .update({
      last_active: todayDate,
      current_streak: newStreak,
    })
    .eq("user_id", userId);

  if (updateError) console.error("Streak update error:", updateError);
}
