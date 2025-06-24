export const selectChat = async (chatSessionId: string) => {
  const res = await fetch("/api/select-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatSessionId }),
  });

  if (!res.ok) {
    throw new Error("Failed to select chat");
  }

  return res.json() as Promise<{
    messages: {
      role: "user" | "assistant" | "system";
      content: string;
      llm_model: string | null;
    }[];
    latestLlmModel: string | null;
  }>;
};
