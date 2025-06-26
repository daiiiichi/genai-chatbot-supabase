export async function loadChatHistories(userId: string) {
  const res = await fetch("/api/history/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "Failed to fetch chat histories.");
  }

  return await res.json();
}
