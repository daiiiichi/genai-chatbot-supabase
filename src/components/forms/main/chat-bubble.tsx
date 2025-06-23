"use client";

import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { isLoadingAtom, messagesAtom, streamedAnswerAtom } from "@/atoms";
import { TypingIndicator } from "../../ui/typing-indicator";
import { cn } from "../../../lib/utils";
import MarkdownDisplay from "../../ui/markdown-display";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export default function ChatBubble() {
  const messages = useAtomValue(messagesAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const streamedAnswer = useAtomValue(streamedAnswerAtom);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 会話が増えたときの自動スクロール設定
  // メッセージが追加されたときにチャット画面が自動的に一番下にスクロールされる仕組み
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading, streamedAnswer]);

  return (
    <div
      ref={chatContainerRef}
      className={cn(
        "flex-col overflow-y-auto relative w-full flex-1 space-y-4 pe-2",
        messages.length > 0 ? "flex" : "hidden"
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
                msg.role === "user"
                  ? "ml-auto max-w-[75%]"
                  : "mr-auto max-w-[95%]"
              )}
            >
              {/* アシスタントのメッセージにLLMモデルの種類の表示 */}
              {msg.role === "assistant" && (
                <Badge className="mb-1" variant={"outline"}>
                  <MessageSquare />
                  {msg.llm_model}
                </Badge>
              )}
              <div
                className={cn(
                  "break-words whitespace-pre-wrap rounded-lg px-3 py-2",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border"
                )}
              >
                {/* アシスタントのメッセージのみマークダウン表示 */}
                {msg.role === "assistant" ? (
                  <MarkdownDisplay content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}

      {/* 回答生成前のインジケーター　および　ストリームで返答される回答を表示する場合 */}
      {isLoading && (
        <div className="flex gap-3 justify-start">
          <div className="max-w-[95%] justify-end">
            <div className="break-words whitespace-normal rounded-lg px-3 py-2 bg-muted text-foreground border">
              {streamedAnswer ? (
                <MarkdownDisplay content={streamedAnswer} />
              ) : (
                <TypingIndicator />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
