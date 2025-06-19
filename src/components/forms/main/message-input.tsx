"use client";

import { useState } from "react";
import { Textarea } from "../../ui/textarea";
import SubmitButton from "./submit-button";
import FileUploadButton from "../../ui/file-upload-button";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  isLoadingAtom,
  messagesAtom,
  streamedAnswerAtom,
  userIdAtom,
} from "@/atoms/chat";
import { insertMessage } from "@/lib/supabase/messages";
import generateTitle from "@/lib/generate-chat-title";
import { fetchChatHistories } from "@/lib/chat-histories";
import { Message } from "@/types/chat";

export default function MessageInput() {
  const [userInput, setUserInput] = useState("");
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setStreamedAnswer = useSetAtom(streamedAnswerAtom);
  const userId = useAtomValue(userIdAtom);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessageObj: Message = {
      role: "user",
      content: userInput,
    };
    const addUserMessages: Message[] = [...messages, userMessageObj];
    setMessages(addUserMessages);
    setStreamedAnswer("");
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

    await insertMessage({
      chat_session_id: currentChatId,
      role: assistantAnswerObj.role,
      content: assistantAnswerObj.content,
    });

    setIsLoading(false);
    setStreamedAnswer("");

    await generateTitle(currentChatId, assistantAnswerObj);
    const updatedChathistories = await fetchChatHistories(userId);
    setChatHistories(updatedChathistories);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-input bg-background rounded-3xl border p-2 shadow-xs w-full max-w-(--breakpoint-md)">
      <Textarea
        className="border-none shadow-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Ask me anything..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-between gap-2 pt-2">
        <FileUploadButton />
        <SubmitButton userInput={userInput} onSend={sendMessage} />
      </div>
    </div>
  );
}
