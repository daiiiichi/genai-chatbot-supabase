export const deleteChat = async (chatSessionId: string) => {
  const res = await fetch("/api/chat/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatSessionId }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete chat");
  }

  return res.json() as Promise<{ success: boolean }>;
};
