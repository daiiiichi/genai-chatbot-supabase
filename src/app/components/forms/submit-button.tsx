"use client";

import { ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Message } from "../../types/chat";

type SubmitButtonProps = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  setChunkedAnswer: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  userInput: string;
  setUserInput: (input: string) => void;
};

export default function SubmitButton({
  messages,
  setMessages,
  setChunkedAnswer,
  setIsLoading,
  isLoading,
  userInput,
  setUserInput,
}: SubmitButtonProps) {
  const sendMessage = async (userInput: string) => {
    const newMessages: Message[] = [
      ...messages,
      { id: messages.length + 1, role: "user", content: userInput },
    ];
    setMessages(newMessages);
    setChunkedAnswer("");
    setIsLoading(true);
    setUserInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
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

    setMessages([
      ...newMessages,
      { id: newMessages.length + 1, role: "assistant", content: fullreply },
    ]);
    setChunkedAnswer("");
    setIsLoading(false);
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
