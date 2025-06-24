import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/api/supabase-client";
import { AzureOpenAI } from "openai";
import { systemPrompts } from "@/lib/prompts";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_KEY_4OMINI!;
const deployment = "gpt-4o-mini";
const apiVersion = "2024-04-01-preview";

const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });

export async function POST(req: NextRequest) {
  try {
    const { chatId, assistantMessage } = await req.json();

    if (!chatId || !assistantMessage) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("chat_sessions")
      .select("title")
      .eq("chat_session_id", chatId);

    const currentTitle = existing?.[0]?.title;
    if (currentTitle !== "New Chat") {
      return NextResponse.json({ title: currentTitle }, { status: 200 });
    }

    const messages = [
      {
        role: "system",
        content: systemPrompts.generateTitle,
      },
      assistantMessage,
    ];

    const completion = await client.chat.completions.create({
      model: deployment,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
    });

    const title = completion.choices[0].message.content;
    const now = new Date().toISOString();

    // タイトル更新
    await supabase
      .from("chat_sessions")
      .update({ title, updated_at: now })
      .eq("chat_session_id", chatId);

    return NextResponse.json({ title }, { status: 200 });
  } catch (err) {
    console.error("タイトル生成エラー:", err);
    return NextResponse.json({ error: "タイトル生成失敗" }, { status: 500 });
  }
}
