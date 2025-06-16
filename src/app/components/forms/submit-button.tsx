"use client";

import { ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Message } from "../../types/chat";
import generateTitle from "@/app/lib/generate-chat-title";
import { insertMessage } from "@/app/lib/supabase/messages";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  messagesAtom,
} from "@/app/atoms/chat";
import { fetchChatHistories } from "@/app/lib/chat-histories";

type SubmitButtonProps = {
  setChunkedAnswer: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  userInput: string;
  setUserInput: (input: string) => void;
};

export default function SubmitButton({
  setChunkedAnswer,
  setIsLoading,
  isLoading,
  userInput,
  setUserInput,
}: SubmitButtonProps) {
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);

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

    await insertMessage({
      chat_session_id: currentChatId,
      role: userMessageObj.role,
      content: userMessageObj.content,
    });

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
    await insertMessage({
      chat_session_id: currentChatId,
      role: assistantAnswerObj.role,
      content: assistantAnswerObj.content,
    });
    setIsLoading(false);

    setChunkedAnswer("");
    await generateTitle(currentChatId, assistantAnswerObj);
    const updatedChathistories = await fetchChatHistories();
    setChatHistories(updatedChathistories);
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
