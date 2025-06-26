import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { chatSessionId } = await req.json();

  if (!chatSessionId) {
    return NextResponse.json(
      { error: "Missing chatSessionId" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("chat_session_id", chatSessionId);

  if (error) {
    console.error("Delete error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
