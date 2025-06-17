"use client";

import { useState, useEffect } from "react";
import MessageInput from "../forms/message-input";
import ChatBubble from "../forms/chat-bubble";
import useAuth from "@/app/hooks/use-auth";
import { useSetAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  messagesAtom,
} from "@/app/atoms/chat";
import { startNewChat } from "@/app/lib/chat";
import { fetchChatHistories } from "@/app/lib/chat-histories";

export default function AppMain() {
  const { session } = useAuth();
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const [initialized, setInitialized] = useState(false);

  // ページ立ち上げ時の処理
  useEffect(() => {
    const initialize = async () => {
      if (!session) return;
      if (initialized) return;

      setInitialized(true); // "New Chat" の二重作成を防ぐ

      const chatHistories = await fetchChatHistories();
      setChatHistories(chatHistories);

      await startNewChat(session, setMessages, setCurrentChatId);

      const newHistories = await fetchChatHistories();
      setChatHistories(newHistories);
    };
    initialize();
  }, [session, initialized]);

  return (
    <div className="p-4">
      <div className="m-auto flex h-[calc(100vh-6rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <ChatBubble />
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
