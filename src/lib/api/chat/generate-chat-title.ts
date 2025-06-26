import { Message } from "@/types/chat";

export default async function generateChatTitle(
  currentChatId: string,
  assistantAnswerObj: Message
) {
  try {
    const res = await fetch("/api/chat/generate-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: currentChatId,
        assistantMessage: assistantAnswerObj,
      }),
    });

    if (!res.ok) {
      throw new Error("タイトル生成に失敗しました");
    }

    const { title } = await res.json();
    return title;
  } catch (err) {
    console.error("タイトル生成エラー（クライアント）:", err);
  }
}
