import { v4 as uuidv4 } from "uuid";
import { supabase } from "./api/supabase-client";
import { Message } from "../types/chat";

const startNewChat = async (
  userId: string
): Promise<
  | {
      messages: Message[];
      chatSessionId: string;
    }
  | undefined
> => {
  if (!userId) {
    throw new Error("User session is not available.");
  }

  const { data: NewChat, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("title", "New Chat");

  if (error) {
    console.error("Error checking existing chats:", error);
    return;
  }

  const messages: Message[] = [];

  // "New Chat"があれば、それを現在の会話にする
  if (NewChat && NewChat.length > 0) {
    return { messages, chatSessionId: NewChat[0].chat_session_id };
  }

  // なければ新規作成
  const chatSessionId = uuidv4();
  const now = new Date().toISOString();

  await supabase.from("chat_sessions").insert([
    {
      chat_session_id: chatSessionId,
      user_id: userId,
      title: "New Chat",
      created_at: now,
      updated_at: now,
    },
  ]);

  return { messages, chatSessionId };
};

export { startNewChat };
