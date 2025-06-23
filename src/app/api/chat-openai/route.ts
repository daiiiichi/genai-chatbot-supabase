import { systemPrompts } from "@/lib/prompts";
import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

export const runtime = "edge";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_KEY;

export async function POST(req: Request) {
  const { messages, modelName } = await req.json();

  const messagesWithSystem = [
    { role: "system", content: systemPrompts.default },
    ...messages,
  ];

  let apiVersion = "";

  if (modelName === "O3-mini") {
    apiVersion = process.env.AZURE_OPENAI_API_VERSION_O3_MINI!;
  } else if (modelName === "gpt-4o-mini") {
    apiVersion = process.env.AZURE_OPENAI_API_VERSION_4O_MINI!;
  } else if (modelName === "gpt-4.1-mini") {
    apiVersion = process.env.AZURE_OPENAI_API_VERSION_41_MINI!;
  }

  console.log(messagesWithSystem);

  const options = { endpoint, apiKey, modelName, apiVersion };
  const client = new AzureOpenAI(options);

  const stream = await client.chat.completions.create({
    model: modelName,
    messages: messagesWithSystem,
    stream: true,
    max_completion_tokens: modelName === "gpt-4o-mini" ? 4096 : 10000,
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    // controllerは、ストリームの制御に使用
    // データ追加(enqueue)やストリームの終了(close)を行う
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
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
}
