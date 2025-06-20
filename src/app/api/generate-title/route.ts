import { AzureOpenAI } from "openai";

export const runtime = "edge";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = "gpt-4o-mini";
const deployment = "gpt-4o-mini";
const apiVersion = "2024-04-01-preview";
const apiKey = process.env.AZURE_OPENAI_KEY_4OMINI;

const options = { endpoint, apiKey, deployment, apiVersion };
const client = new AzureOpenAI(options);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log(messages);

    const response = await client.chat.completions.create({
      model: modelName,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
    });

    const result = response.choices[0].message.content;
    console.log(result);

    return new Response(result, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return new Response("生成に失敗しました。", { status: 500 });
  }
}
