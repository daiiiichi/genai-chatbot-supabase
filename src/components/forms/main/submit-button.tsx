"use client";

import { ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Message } from "../../../types/chat";
import generateTitle from "@/lib/generate-chat-title";
import { insertMessage } from "@/lib/supabase/messages";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  isLoadingAtom,
  messagesAtom,
  streamedAnswerAtom,
  userIdAtom,
} from "@/atoms/chat";
import { fetchChatHistories } from "@/lib/chat-histories";

type SubmitButtonProps = {
  userInput: string;
  setUserInput: (input: string) => void;
};

export default function SubmitButton({
  userInput,
  setUserInput,
}: SubmitButtonProps) {
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const setStreamedAnswer = useSetAtom(streamedAnswerAtom);
  const userId = useAtomValue(userIdAtom);

  const sendMessage = async (userInput: string) => {
    // ユーザー入力内容の成型とチャット返答準備
    const userMessageObj: Message = {
      role: "user",
      content: userInput,
    };
    const addUserMessages: Message[] = [...messages, userMessageObj];
    setMessages(addUserMessages);
    setStreamedAnswer("");
    setIsLoading(true);
    setUserInput("");

    // ユーザメッセージのsupabaseへの保存
    await insertMessage({
      chat_session_id: currentChatId,
      role: userMessageObj.role,
      content: userMessageObj.content,
    });

    // LLMのメッセージをstreamで受け取る
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
      setStreamedAnswer((prev) => prev + chunk);
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

    // LLMの返答をsupabaseに保存
    await insertMessage({
      chat_session_id: currentChatId,
      role: assistantAnswerObj.role,
      content: assistantAnswerObj.content,
    });

    setIsLoading(false);
    setStreamedAnswer("");

    // チャットタイトルの作成とサイドバーのチャットり履歴の更新
    await generateTitle(currentChatId, assistantAnswerObj);
    const updatedChathistories = await fetchChatHistories(userId);
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
