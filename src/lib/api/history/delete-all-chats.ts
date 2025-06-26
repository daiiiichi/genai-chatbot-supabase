export const deleteAllChats = async (userId: string) => {
  const res = await fetch("/api/history/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete all chats");
  }

  return res.json() as Promise<{ success: boolean }>;
};
