// src/utils/coinUtils.js
import { supabase } from "../Supabase/supabaseClient";

// ✅ Create coin row if not exist
export async function ensureUserCoins(userId) {
  const { data, error } = await supabase
    .from("coins")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    await supabase.from("coins").insert({
      user_id: userId,
      balance: 0,
    });
    return { balance: 0 };
  }

  return data;
}

// ✅ Get user coin balance
export async function getCoins(userId) {
  const { data } = await supabase
    .from("coins")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.balance ?? 0;
}

// ✅ Add coins
export async function addCoins(userId, amount) {
  const current = await getCoins(userId);
  const newBalance = current + amount;

  await supabase
    .from("coins")
    .update({ balance: newBalance })
    .eq("user_id", userId);

  return newBalance;
}

// ✅ Deduct coins (like 5 coins for explanation)
export async function deductCoins(userId, amount) {
  const current = await getCoins(userId);

  if (current < amount) return null; // ❌ not enough coins

  const newBalance = current - amount;

  await supabase
    .from("coins")
    .update({ balance: newBalance })
    .eq("user_id", userId);

  return newBalance;
}
