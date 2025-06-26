"use client";

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
  userInputAtom,
} from "@/atoms";
import { insertMessage } from "@/lib/api/message/insert-message";
import generateChatTitle from "@/lib/api/chat/generate-chat-title";
import { loadChatHistories } from "@/lib/api/history/load-chat-histories";
import { Message } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import { CircleCheckBig } from "lucide-react";
import { sendMessageToLLM } from "@/lib/api/answer/send-message-to-llm";

export default function MessageInput() {
  const [userInput, setUserInput] = useAtom(userInputAtom);
  const currentChatId = useAtomValue(currentChatIdAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setStreamedAnswer = useSetAtom(streamedAnswerAtom);
  const userId = useAtomValue(userIdAtom);
  const llmModel = useAtomValue(llmModelAtom);
  const setLlmComboboxOpen = useSetAtom(llmComboboxOpenAtom);

  const sendMessage = async () => {
    // ユーザーメッセージの成型とメッセージ送信時の前準備
    const userMessageObj: Message = {
      role: "user",
      content: userInput,
      llm_model: null,
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
      llm_model: userMessageObj.llm_model,
    });

    try {
      const answer = await sendMessageToLLM({
        messages: addUserMessages,
        modelName: llmModel,
        onChunk: (chunk) => {
          setStreamedAnswer((prev) => prev + chunk);
        },
      });

      setIsLoading(false);

      // 回答の成型
      const assistantAnswerObj: Message = {
        role: "assistant",
        content: answer,
        llm_model: llmModel,
      };
      const addAssistantMessages: Message[] = [
        ...addUserMessages,
        assistantAnswerObj,
      ];
      setMessages(addAssistantMessages);
      setStreamedAnswer("");

      // 回答の supabase への保存
      await insertMessage({
        chat_session_id: currentChatId,
        role: assistantAnswerObj.role,
        content: assistantAnswerObj.content,
        llm_model: llmModel,
      });

      // チャットタイトルの作成
      // [TODO] タイトル作成の際に使用する会話の検討
      // １回目の返答のみを用いてタイトル作成（2025/6/19）
      await generateChatTitle(currentChatId, assistantAnswerObj);
      const updatedChatHistories = await loadChatHistories(userId);
      setChatHistories(updatedChatHistories);
    } catch (err: unknown) {
      console.error("チャット送信中にエラー:", err);
      alert(
        "メッセージの送信中にエラーが発生しました。\n再読み込みをしてから再度実行をお願いします。"
      );
    }
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
            {llmModel}
          </Badge>
          <SubmitButton userInput={userInput} onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
