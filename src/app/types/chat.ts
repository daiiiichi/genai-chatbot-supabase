// メッセージ
export type Message = {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
};
