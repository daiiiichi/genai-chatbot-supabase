// fetchChatHistories.ts
import { supabase } from "./supabase/supabase-client";

export const fetchChatHistories = async () => {
  const { data, error } = await supabase.from("chat_sessions").select();
  return error ? [] : data;
};
