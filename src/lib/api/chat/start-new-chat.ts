export const startNewChat = async (userId: string) => {
  const res = await fetch("/api/chat/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to start new chat");
  }

  return res.json() as Promise<{
    chatSessionId: string;
    messages: {
      role: "user" | "assistant" | "system";
      content: string;
      llm_model: string | null;
    }[];
  }>;
};
