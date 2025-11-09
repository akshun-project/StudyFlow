 // src/utils/coinUtils.js
import { supabase } from "../Supabase/supabaseClient";

// ✅ Ensure user has a coin row
async function ensureUserCoins(userId) {
  const { data } = await supabase
    .from("coins")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    const { data: newRow } = await supabase
      .from("coins")
      .insert({ user_id: userId, balance: 0 })
      .select()
      .single();

    return newRow;
  }

  return data;
}

// ✅ Get user coin balance (ALWAYS safe)
export async function getCoins(userId) {
  const row = await ensureUserCoins(userId);
  return row.balance ?? 0;
}

// ✅ Add coins safely
export async function addCoins(userId, amount) {
  const row = await ensureUserCoins(userId);
  const newBalance = row.balance + amount;

  await supabase
    .from("coins")
    .update({ balance: newBalance })
    .eq("user_id", userId);

  return newBalance;
}

// ✅ Deduct coins safely
export async function deductCoins(userId, amount) {
  const row = await ensureUserCoins(userId);

  if (row.balance < amount) return null;

  const newBalance = row.balance - amount;

  await supabase
    .from("coins")
    .update({ balance: newBalance })
    .eq("user_id", userId);

  return newBalance;
}
