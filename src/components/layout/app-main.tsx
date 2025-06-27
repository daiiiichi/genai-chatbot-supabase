"use client";

import { useState, useEffect } from "react";
import MessageInput from "../forms/main/message-input";
import ChatBubble from "../forms/main/chat-bubble";
import useAuth from "@/hooks/use-auth";
import { useSetAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  llmModelAtom,
  messagesAtom,
  userIdAtom,
} from "@/atoms";
import { startNewChat } from "@/lib/api/chat/start-new-chat";
import { loadChatHistories } from "@/lib/api/history/load-chat-histories";
import SamplePrompt from "../forms/main/sumple-prompt";
import { useRouter, useSearchParams } from "next/navigation";
import { selectChat } from "@/lib/api/chat/select-chat";
import { DEFAULT_LLM_MODEL } from "@/constants/llm-model-list";

export default function AppMain() {
  const { session } = useAuth();
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const [initialized, setInitialized] = useState(false);
  const setUserId = useSetAtom(userIdAtom);
  const setLlmModel = useSetAtom(llmModelAtom);
  const router = useRouter();
  const searchParams = useSearchParams();

  // ページ立ち上げ時の処理
  useEffect(() => {
    const initialize = async () => {
      if (!session) return;
      if (initialized) return;

      setInitialized(true); // "New Chat" の二重作成を防ぐ目的
      setUserId(session.user.id);

      // 画面リロードやお気に入り保存の場合、URLからchatIdを参照する
      const chatIdFromURL = searchParams.get("chatId");

      if (chatIdFromURL) {
        const existingChat = await selectChat(chatIdFromURL);
        if (existingChat) {
          setMessages(existingChat.messages);
          setCurrentChatId(chatIdFromURL);
          setLlmModel(existingChat.latestLlmModel ?? DEFAULT_LLM_MODEL);
          return;
        }
      }

      // ページ立ち上げ時には新規チャットを作成
      const newChat = await startNewChat(session.user.id);
      if (newChat) {
        router.push(`/?chatId=${newChat.chatSessionId}`);
        setMessages(newChat.messages);
        setCurrentChatId(newChat.chatSessionId);
      }

      const chatHistories = await loadChatHistories(session?.user.id);
      setChatHistories(chatHistories);
    };
    initialize();
  }, [
    session,
    initialized,
    setUserId,
    setMessages,
    setCurrentChatId,
    setChatHistories,
  ]);

  return (
    <div className="p-4">
      <div className="m-auto flex h-[calc(100vh-6rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <ChatBubble />
          <MessageInput />
          <SamplePrompt />
        </div>
      </div>
    </div>
  );
}
