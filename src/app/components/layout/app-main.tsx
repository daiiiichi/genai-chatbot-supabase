"use client";

import { useState } from "react";
import MessageInput from "../forms/message-input";
import ChatBubble from "../forms/chat-bubble";

export default function AppMain() {
  const [chunkedAnswer, setChunkedAnswer] = useState("");

  return (
    <div className="p-4">
      <div className="m-auto flex h-[calc(100vh-6rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <ChatBubble chunkedAnswer={chunkedAnswer} />
          <MessageInput setChunkedAnswer={setChunkedAnswer} />
        </div>
      </div>
    </div>
  );
}
