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
  llmModelAtom,
  messagesAtom,
  streamedAnswerAtom,
  userIdAtom,
  llmComboboxOpenAtom,
} from "@/atoms/chat";
import { insertMessage } from "@/lib/supabase/messages";
import generateTitle from "@/lib/generate-chat-title";
import { fetchChatHistories } from "@/lib/chat-histories";
import { Message } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig } from "lucide-react";

export default function MessageInput() {
  const [userInput, setUserInput] = useState("");
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setStreamedAnswer = useSetAtom(streamedAnswerAtom);
  const userId = useAtomValue(userIdAtom);
  const llmModel = useAtomValue(llmModelAtom);
  const setLlmComboboxOpen = useSetAtom(llmComboboxOpenAtom);

  // メッセージ送信時の処理
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // ユーザーメッセージの成型とメッセージ送信時の前準備
    const userMessageObj: Message = {
      role: "user",
      content: userInput,
    };
    const addUserMessages: Message[] = [...messages, userMessageObj];
    setMessages(addUserMessages);
    setStreamedAnswer("");
    setIsLoading(true);
    setUserInput("");

    // メッセージの supabase への保存
    await insertMessage({
      chat_session_id: currentChatId,
      role: userMessageObj.role,
      content: userMessageObj.content,
    });

    // ストリームで回答を収集
    let res: Response;

    if (llmModel.value.startsWith("gemini")) {
      res = await fetch("/api/chat-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: addUserMessages }),
      });
    } else {
      res = await fetch("/api/chat-openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: addUserMessages,
          modelName: llmModel.value,
          apiVersion: llmModel.api_version,
        }),
      });
    }

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

    // 回答の成型
    const assistantAnswerObj: Message = {
      role: "assistant",
      content: fullreply,
    };
    const addAssistantMessages: Message[] = [
      ...addUserMessages,
      assistantAnswerObj,
    ];
    setMessages(addAssistantMessages);

    // 回答の supabase への保存
    await insertMessage({
      chat_session_id: currentChatId,
      role: assistantAnswerObj.role,
      content: assistantAnswerObj.content,
    });

    setIsLoading(false);
    setStreamedAnswer("");

    // チャットタイトルの作成
    // [TODO] タイトル作成の際に使用する会話の検討
    // １回目の返答のみを用いてタイトル作成（2025/6/19）
    await generateTitle(currentChatId, assistantAnswerObj);
    const updatedChathistories = await fetchChatHistories(userId);
    setChatHistories(updatedChathistories);
  };

  // 入力したメッセージを Enter で送れるようにするための処理
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
        <div className="flex gap-4">
          <Badge
            variant={"outline"}
            onClick={() => setLlmComboboxOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <CircleCheckBig />
            {llmModel.value}
          </Badge>
          <SubmitButton userInput={userInput} onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
