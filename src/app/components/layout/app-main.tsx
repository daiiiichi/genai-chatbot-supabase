"use client";

import { useState } from "react";
import MessageInput from "../forms/message-input";
import { Message } from "../../types/chat";
import ChatBubble from "../forms/chat-bubble";

export default function AppMain() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "system", content: "You are a helpful assistant." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chunkedAnswer, setChunkedAnswer] = useState("");

  return (
    <div className="p-4">
      <div className="m-auto flex h-[calc(100vh-6rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <ChatBubble
            messages={messages}
            isLoading={isLoading}
            chunkedAnswer={chunkedAnswer}
          />
          <MessageInput
            messages={messages}
            setMessages={setMessages}
            setChunkedAnswer={setChunkedAnswer}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
}
