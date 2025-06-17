import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/supabase-client";
import { Message } from "../types/chat";

const startNewChat = async (
  session: any,
  setMessages: (messages: Message[]) => void,
  setCurrentChatId: (chatId: string) => void
) => {
  const chatSessionId = uuidv4();
  const now = new Date().toISOString();
  if (!session || !session.user) {
    throw new Error("User session is not available.");
  }
  await supabase.from("chat_sessions").insert([
    {
      chat_session_id: chatSessionId,
      user_id: session.user.id,
      title: "New Chat",
      created_at: now,
      updated_at: now,
    },
  ]);

  setMessages([{ role: "system", content: "You are a helpful assistant." }]);
  setCurrentChatId(chatSessionId);
};

export { startNewChat };
