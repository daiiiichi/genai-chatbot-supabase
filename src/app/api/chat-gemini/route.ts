import { convertToGeminiFormat } from "@/lib/gemini";
import { systemPrompts } from "@/lib/prompts";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apikey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: apikey });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const geminiFormat = convertToGeminiFormat(messages);
    console.log(geminiFormat);

    const chat = await ai.chats.create({
      model: "gemini-2.0-flash-lite",
      history: geminiFormat.history,
      config: {
        systemInstruction: systemPrompts.default,
      },
    });

    const stream = await chat.sendMessageStream(geminiFormat.latestMessage);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      // controllerは、ストリームの制御に使用
      // データ追加(enqueue)やストリームの終了(close)を行う
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.text;
          if (content) {
            controller.enqueue(encoder.encode(content)); //
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err: any) {
    return (
      new NextResponse(JSON.stringify({ error: err.messages })),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
