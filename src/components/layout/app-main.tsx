"use client";

import { useState, useEffect } from "react";
import MessageInput from "../forms/main/message-input";
import ChatBubble from "../forms/main/chat-bubble";
import useAuth from "@/hooks/use-auth";
import { useSetAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  messagesAtom,
  userIdAtom,
} from "@/atoms/chat";
import { startNewChat } from "@/lib/chat";
import { fetchChatHistories } from "@/lib/chat-histories";

export default function AppMain() {
  const { session } = useAuth();
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const [initialized, setInitialized] = useState(false);
  const setUserId = useSetAtom(userIdAtom);

  // ページ立ち上げ時の処理
  useEffect(() => {
    const initialize = async () => {
      if (!session) return;
      if (initialized) return;

      setInitialized(true); // "New Chat" の二重作成を防ぐ
      setUserId(session.user.id);

      const chatHistories = await fetchChatHistories(session?.user.id);
      setChatHistories(chatHistories);

      await startNewChat(session.user.id, setMessages, setCurrentChatId);

      const newHistories = await fetchChatHistories(session?.user.id);
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
