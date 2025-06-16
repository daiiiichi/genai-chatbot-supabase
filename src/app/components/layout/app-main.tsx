"use client";

import { useEffect, useState } from "react";
import MessageInput from "../forms/message-input";
import ChatBubble from "../forms/chat-bubble";
import useAuth from "@/app/hooks/use-auth";
import { useSetAtom } from "jotai";
import { currentChatIdAtom, messagesAtom } from "@/app/atoms/chat";
import { startNewChat } from "@/app/lib/chat";

export default function AppMain() {
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const setMessages = useSetAtom(messagesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [chunkedAnswer, setChunkedAnswer] = useState("");
  const { session } = useAuth();

  useEffect(() => {
    if (session && session.user) {
      startNewChat(session, setMessages, setCurrentChatId);
      console.log("New chat session started.");
    }
  }, [session?.user?.id]);

  return (
    <div className="p-4">
      <div className="m-auto flex h-[calc(100vh-6rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <ChatBubble isLoading={isLoading} chunkedAnswer={chunkedAnswer} />
          <MessageInput
            setChunkedAnswer={setChunkedAnswer}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
}
