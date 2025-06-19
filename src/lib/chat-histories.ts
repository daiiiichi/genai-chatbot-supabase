import { supabase } from "./supabase/supabase-client";

export const fetchChatHistories = async (user_id: string) => {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select()
    .eq("user_id", user_id);
  return error ? [] : data;
};
