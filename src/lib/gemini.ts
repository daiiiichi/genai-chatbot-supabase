import { Message } from "@/types/chat";

export function convertToGeminiFormat(openaiFormat: Message[]) {
  // システムプロンプトの削除
  const filtered = openaiFormat.filter((m) => m.role !== "system");

  // 最後のメッセージを分離
  const previous = filtered.slice(0, -1);
  const latest = filtered[filtered.length - 1];

  // OpenAI → Gemini に変換
  const history = previous.map((msg) => ({
    role: msg.role === "assistant" ? "model" : msg.role,
    parts: [{ text: msg.content }],
  }));

  const latestMessage: { message: string } = {
    message: latest.content,
  };

  return { history, latestMessage };
}
