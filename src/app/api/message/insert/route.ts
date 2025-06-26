import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const body = await req.json();

  const { chat_session_id, role, content, llm_model } = body;

  if (!chat_session_id || !role || !content) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("messages").insert([
    {
      chat_session_id,
      role,
      content,
      llm_model,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Insert error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
