import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { data: existing, error: selectErr } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("title", "New Chat");

  if (selectErr) {
    console.error(selectErr);
    return NextResponse.json({ error: selectErr.message }, { status: 500 });
  }

  // "New Chat"があれば、それを現在の会話にする
  if (existing?.length) {
    return NextResponse.json({
      chatSessionId: existing[0].chat_session_id,
      messages: [],
    });
  }

  // なければ新規作成
  const chatSessionId = uuidv4();
  const now = new Date().toISOString();
  const { error: insertErr } = await supabase.from("chat_sessions").insert([
    {
      chat_session_id: chatSessionId,
      user_id: userId,
      title: "New Chat",
      created_at: now,
      updated_at: now,
    },
  ]);

  if (insertErr) {
    console.error(insertErr);
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ chatSessionId, messages: [] });
}
