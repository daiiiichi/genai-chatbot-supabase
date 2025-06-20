import { Message } from "@/types/chat";
import { supabase } from "./supabase-client";

export async function insertMessage({
  chat_session_id,
  role,
  content,
}: {
  chat_session_id: string;
  role: Message["role"];
  content: string;
}) {
  if (!chat_session_id) {
    throw new Error("Session ID is required to insert a message.");
  }
  const { error } = await supabase.from("messages").insert([
    {
      chat_session_id,
      role,
      content,
      created_at: new Date().toISOString(),
    },
  ]);
  if (error) {
    console.error("Insert error:", error.message);
  }
}
