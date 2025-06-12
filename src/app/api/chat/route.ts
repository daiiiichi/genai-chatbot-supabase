import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

export const runtime = "edge";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_MODEL_NAME_O3MINI || "o3-mini";
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME_O3MINI;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION_O3MINI;
const apiKey = process.env.AZURE_OPENAI_KEY;

const options = { endpoint, apiKey, deployment, apiVersion };
const client = new AzureOpenAI(options);

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log(messages);

  const stream = await client.chat.completions.create({
    model: modelName,
    messages,
    stream: true,
    max_completion_tokens: 100000,
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
