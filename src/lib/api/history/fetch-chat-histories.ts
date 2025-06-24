export async function fetchChatHistories(userId: string) {
  const res = await fetch("/api/history/get", {
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
