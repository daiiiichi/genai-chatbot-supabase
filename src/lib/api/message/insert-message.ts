import { Message } from "@/types/chat";

export async function insertMessage({
  chat_session_id,
  role,
  content,
  llm_model,
}: {
  chat_session_id: string;
  role: Message["role"];
  content: string;
  llm_model: string | null;
}) {
  const res = await fetch("/api/message/insert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_session_id,
      role,
      content,
      llm_model,
    }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to insert message.");
  }
}
