import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/supabase-client";
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

const selectChat = async (
  selectedChatId: string
): Promise<{ messages: Message[]; latestLlmModel: string | null }> => {
  const { data } = await supabase
    .from("messages")
    .select()
    .eq("chat_session_id", selectedChatId);

  if (!data) {
    return { messages: [], latestLlmModel: null };
  }

  // 日時の順番に並べる
  const sorted = data.sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const messages: Message[] = sorted.map((m) => ({
    role: m.role as "user" | "assistant" | "system",
    content: m.content as string,
    llm_model: m.llm_model as string | null,
  }));

  // 最新の assistant メッセージの LLMモデル を取得
  const latestLlmModel =
    [...sorted].reverse().find((m) => m.role === "assistant")?.llm_model ??
    null;

  return { messages, latestLlmModel };
};

const deleteChat = async (selectedChatId: string) => {
  await supabase
    .from("chat_sessions")
    .delete()
    .eq("chat_session_id", selectedChatId);
};

const deleteAllChats = async (userId: string) => {
  if (!userId) {
    throw new Error("User session is not available.");
  }
  await supabase.from("chat_sessions").delete().eq("user_id", userId);
};

export { startNewChat, selectChat, deleteChat, deleteAllChats };
