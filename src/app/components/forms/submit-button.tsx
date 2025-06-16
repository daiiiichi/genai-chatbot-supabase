"use client";

import { ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Message } from "../../types/chat";
import { supabase } from "@/app/lib/supabase-client";

type SubmitButtonProps = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setChunkedAnswer: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  userInput: string;
  setUserInput: (input: string) => void;
  currentChatId: string | null;
};

export default function SubmitButton({
  messages,
  setMessages,
  setChunkedAnswer,
  setIsLoading,
  isLoading,
  userInput,
  setUserInput,
  currentChatId,
}: SubmitButtonProps) {
  const sendMessage = async (userInput: string) => {
    const userMessageObj: Message = {
      role: "user",
      content: userInput,
    };
    const addUserMessages: Message[] = [...messages, userMessageObj];
    setMessages(addUserMessages);
    setChunkedAnswer("");
    setIsLoading(true);
    setUserInput("");

    if (!currentChatId) {
      throw new Error("Session ID is required to insert a message.");
    }
    console.log(currentChatId);
    const { error: insertError } = await supabase.from("messages").insert([
      {
        chat_session_id: currentChatId,
        role: userMessageObj.role,
        content: userMessageObj.content,
        created_at: new Date().toISOString(),
      },
    ]);
    if (insertError) {
      console.error("Insert error:", insertError.message);
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: addUserMessages }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) return;

    let fullreply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullreply += chunk;
      setChunkedAnswer((prev) => prev + chunk);
    }

    const assistantAnswerObj: Message = {
      role: "assistant",
      content: fullreply,
    };
    const addAssistantMessages: Message[] = [
      ...addUserMessages,
      assistantAnswerObj,
    ];

    setMessages(addAssistantMessages);
    await supabase.from("messages").insert([
      {
        chat_session_id: currentChatId,
        role: assistantAnswerObj.role,
        content: assistantAnswerObj.content,
        created_at: new Date().toISOString(),
      },
    ]);

    setChunkedAnswer("");
    setIsLoading(false);

    const { data } = await supabase
      .from("chat_sessions")
      .select("title")
      .eq("chat_session_id", currentChatId);

    let chatTitle = data && data.length > 0 ? data[0].title : null;
    if (chatTitle === "New Chat") {
      const titleRes = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              id: 0,
              role: "system",
              content:
                "あなたは検索履歴のタイトル作成に秀でています。以下の会話を参考にタイトルを４語以内で考えてください。返答は必ずタイトルのみでお願いします。",
            },
            assistantAnswerObj,
          ],
        }),
      });
      chatTitle = await titleRes.text();
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("chat_sessions")
      .update({ title: chatTitle, updated_at: now })
      .eq("chat_session_id", currentChatId);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="submit"
            onClick={() => sendMessage(userInput)}
            title="Send Message"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all
                 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:shrink-0 [&_svg]:size-4 
                 outline-none focus-visible:border-ring focus-visible:ring-50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
                 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9 h-8 w-8 rounded-full"
            data-state="closed"
            disabled={isLoading || !userInput.trim()}
          >
            <ArrowUp className="lucide lucide-arrow-up" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send Message</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
