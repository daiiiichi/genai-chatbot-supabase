// メッセージ
export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  llm_model: string | null;
};
