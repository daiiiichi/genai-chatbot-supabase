import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/api/supabase-client";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
