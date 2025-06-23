import { Message } from "@/types/chat";
import { supabase } from "./supabase-client";

export async function insertMessage({
  chat_session_id,
  role,
  content,
  llm_model,
}: {
  chat_session_id: string;
  role: Message["role"];
  content: string;
  llm_model: string | null;
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
      llm_model,
    },
  ]);
  if (error) {
    console.error("Insert error:", error.message);
  }
}
