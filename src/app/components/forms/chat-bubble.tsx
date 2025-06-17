"use client";

import { useAtomValue } from "jotai";
import {
  isLoadingAtom,
  messagesAtom,
  streamedAnswerAtom,
} from "@/app/atoms/chat";
import { TypingIndicator } from "../ui/typing-indicator";
import { cn } from "../../lib/utils";

export default function ChatBubble() {
  const messages = useAtomValue(messagesAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const streamedAnswer = useAtomValue(streamedAnswerAtom);

  return (
    <div
      className={cn(
        "flex-col overflow-y-auto relative w-full flex-1 space-y-4 pe-2",
        messages.length > 1 ? "flex" : "hidden"
      )}
    >
      {messages
        .filter((msg) => msg.role !== "system")
        .map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] flex-1 sm:max-w-[75%]",
                msg.role === "user" && "justify-end text-end"
              )}
            >
              <div
                className={cn(
                  "prose break-words whitespace-normal rounded-lg px-3 py-2 inline-flex",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground text-start"
                    : "bg-muted text-foreground border"
                )}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="max-w-[85%] flex-1 sm:max-w-[75%] justify-end">
            <div className="prose break-words whitespace-normal rounded-lg px-3 py-2 inline-flex bg-muted text-foreground border">
              {streamedAnswer ? streamedAnswer : <TypingIndicator />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
