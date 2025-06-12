"use client";

import { Message } from "../../types/chat";
import { TypingIndicator } from "../ui/typing-indicator";

type ChatBubbleProps = {
  messages: Message[];
  isLoading: boolean;
  chunkedAnswer: string;
};

export default function ChatBubble({
  messages,
  isLoading,
  chunkedAnswer,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex-col overflow-y-auto relative w-full flex-1 space-y-4 pe-2 ${
        messages.length > 1 ? "flex" : "hidden"
      }`}
    >
      {messages
        .filter((msg) => msg.role !== "system")
        .map((msg, idx) => (
          <div
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
            key={idx}
          >
            <div
              className={`max-w-[85%] flex-1 sm:max-w-[75%] ${
                msg.role === "user" ? "justify-end text-end" : ""
              }`}
            >
              <div
                className={`prose break-words whitespace-normal rounded-lg px-3 py-2 inline-flex ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground text-start"
                    : "bg-muted text-foreground border"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      {isLoading && (
        <div className={`flex gap-3 justify-start`}>
          <div className={`max-w-[85%] flex-1 sm:max-w-[75%] justify-end`}>
            <div
              className={`prose break-words whitespace-normal rounded-lg px-3 py-2 inline-flex bg-muted text-foreground border`}
            >
              {chunkedAnswer ? chunkedAnswer : <TypingIndicator />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
