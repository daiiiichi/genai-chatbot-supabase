import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { chatSessionId } = await req.json();
  if (!chatSessionId)
    return NextResponse.json(
      { error: "Missing chatSessionId" },
      { status: 400 }
    );

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_session_id", chatSessionId);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const sorted = (data || []).sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const messages = sorted.map((m) => ({
    role: m.role as "user" | "assostant" | "system",
    content: m.content as string,
    llm_model: m.llm_model as string | null,
  }));
  const latestLlmModel =
    [...sorted].reverse().find((m) => m.role === "assistant")?.llm_model ||
    null;

  return NextResponse.json({ messages, latestLlmModel });
}
