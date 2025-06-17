import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/supabase-client";
import { Message } from "../types/chat";
import type { Session } from "@supabase/supabase-js";

const startNewChat = async (
  session: Session | null | undefined,
  setMessages: (messages: Message[]) => void,
  setCurrentChatId: (chatId: string) => void
) => {
  if (!session || !session.user) {
    throw new Error("User session is not available.");
  }

  // すでに "New Chat" があるかチェック
  const { data: NewChat, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("title", "New Chat");

  if (error) {
    console.error("Error checking existing chats:", error);
    return;
  }

  if (NewChat && NewChat.length > 0) {
    setMessages([{ role: "system", content: "You are a helpful assistant." }]);
    setCurrentChatId(NewChat[0].chat_session_id);
    return;
  }

  // なければ新規作成
  const chatSessionId = uuidv4();
  const now = new Date().toISOString();

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

const selectChat = async (
  selectedChatId: string,
  setCurrentChatId: (chatId: string) => void,
  setMessages: (messages: Message[]) => void
) => {
  setCurrentChatId(selectedChatId);
  const { data } = await supabase
    .from("messages")
    .select()
    .eq("chat_session_id", selectedChatId);

  if (data) {
    const messages: Message[] = data
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
      .map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content as string,
      }));

    setMessages(messages);
  }
};

const deleteChat = async (selectedChatId: string) => {
  await supabase
    .from("chat_sessions")
    .delete()
    .eq("chat_session_id", selectedChatId);
};

const deleteAllChats = async (session: Session | null | undefined) => {
  if (!session || !session.user || !session.user.id) {
    throw new Error("User session is not available.");
  }
  await supabase.from("chat_sessions").delete().eq("user_id", session.user.id);
};

export { startNewChat, selectChat, deleteChat, deleteAllChats };
