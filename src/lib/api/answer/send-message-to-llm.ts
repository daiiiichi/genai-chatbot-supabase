import { Message } from "@/types/chat";

export const sendMessageToLLM = async ({
  messages,
  modelName,
  onChunk,
}: {
  messages: Message[];
  modelName: string;
  onChunk?: (chunk: string) => void;
}): Promise<string> => {
  // llm_modelはAPI送信に必要ないので削除
  const cleanMessages = messages.map(({ role, content }) => ({
    role,
    content,
  }));

  // openai or geminiで、API先と送信内容を条件分岐
  const isGemini = modelName.startsWith("gemini");
  const res = await fetch(
    isGemini ? "/api/answer/gemini" : "/api/answer/openai",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isGemini
          ? { messages: cleanMessages }
          : { messages: cleanMessages, modelName }
      ),
    }
  );

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(errorData || "サーバーエラーが発生しました。");
  }

  // ストリームで回答を収集
  const reader = res.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  if (!reader) throw new Error("レスポンスの読み取りに失敗しました。");

  let fullReply = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    fullReply += chunk;
    onChunk?.(chunk);
  }

  return fullReply;
};
