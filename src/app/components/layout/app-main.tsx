"use client";

import { useEffect, useState } from "react";
import MessageInput from "../forms/message-input";
import { Message } from "../../types/chat";
import ChatBubble from "../forms/chat-bubble";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/app/lib/supabase-client";
import useAuth from "@/app/hooks/use-auth";

export default function AppMain() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chunkedAnswer, setChunkedAnswer] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const { session } = useAuth();

  const startNewChat = async () => {
    const chatSessionId = uuidv4();
    const now = new Date().toISOString();
    if (!session || !session.user) {
      throw new Error("User session is not available.");
    }
    await supabase.from("chat_sessions").insert([
      {
        chat_session_id: chatSessionId,
        user_id: session.user.id,
        title: "New Chat",
        created_at: now,
        updated_at: now,
      },
    ]);

    setMessages([{ role: "system", content: "You are a helpful assistant." }]);
    setSelectedSessionId(chatSessionId);
  };

  useEffect(() => {
    if (session && session.user) {
      startNewChat();
      console.log("New chat session started.");
    }
  }, [session?.user?.id]);

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
            currentChatId={selectedSessionId}
          />
        </div>
      </div>
    </div>
  );
}
