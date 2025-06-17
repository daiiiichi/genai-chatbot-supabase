import { Message } from "../types/chat";
import { supabase } from "./supabase/supabase-client";

export default async function generateTitle(
  currentChatId: string,
  assistantAnswerObj: Message
) {
  // 現在のchat_sessionのタイトルを取得
  const { data } = await supabase
    .from("chat_sessions")
    .select("title")
    .eq("chat_session_id", currentChatId);

  // タイトルが初期値の"New Chat"の場合は、タイトル作成
  let chatTitle = data && data.length > 0 ? data[0].title : null;
  if (chatTitle === "New Chat") {
    const titleRes = await fetch("/api/generate-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            id: 0,
            role: "system",
            content:
              "あなたは検索履歴のタイトル作成に秀でています。以下の会話を参考にタイトルを6語以内で考えてください。返答は必ずタイトルのみでお願いします。",
          },
          assistantAnswerObj,
        ],
      }),
    });
    chatTitle = await titleRes.text();
  }
  const now = new Date().toISOString();

  // タイトルの更新
  await supabase
    .from("chat_sessions")
    .update({ title: chatTitle, updated_at: now })
    .eq("chat_session_id", currentChatId);
}
