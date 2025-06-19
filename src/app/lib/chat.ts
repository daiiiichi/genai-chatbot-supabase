import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase/supabase-client";
import { Message } from "../types/chat";
import type { Session } from "@supabase/supabase-js";

const startNewChat = async (
  userId: string,
  setMessages: (messages: Message[]) => void,
  setCurrentChatId: (chatId: string) => void
) => {
  if (!userId) {
    throw new Error("User session is not available.");
  }

  // すでに "New Chat" があるかチェック
  const { data: NewChat, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("title", "New Chat");

  if (error) {
    console.error("Error checking existing chats:", error);
    return;
  }

  if (NewChat && NewChat.length > 0) {
    setMessages([
      {
        role: "system",
        content:
          "あなたは優秀なアシスタントです。回答は常に Markdown 形式で記述してください（コード、リスト、見出し、表などを含む）。プレーンテキストは使用せず、常に適切な Markdown 構文を用いてください。回答には状況に応じて自然な絵文字（例: ✅ 🔍 💡 🚀 など）を使って、読みやすく親しみやすい表現を心がけてください。ただし、マークダウンの冒頭に「```markdown」などは記述しないでください。h2-6は使用してよいですが、h1見出しは使用しないでください。",
      },
    ]);
    setCurrentChatId(NewChat[0].chat_session_id);
    return;
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

  setMessages([
    {
      role: "system",
      content:
        "あなたは優秀なアシスタントです。回答は常に Markdown 形式で記述してください（コード、リスト、見出し、表などを含む）。プレーンテキストは使用せず、常に適切な Markdown 構文を用いてください。回答には状況に応じて自然な絵文字（例: ✅ 🔍 💡 🚀 など）を使って、読みやすく親しみやすい表現を心がけてください。ただし、マークダウンの冒頭に「```markdown」などは記述しないでください。h2-6は使用してよいですが、h1見出しは使用しないでください。",
    },
  ]);
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

const deleteAllChats = async (userId: string) => {
  if (!userId) {
    throw new Error("User session is not available.");
  }
  await supabase.from("chat_sessions").delete().eq("user_id", userId);
};

export { startNewChat, selectChat, deleteChat, deleteAllChats };
