import { Trash2 } from "lucide-react";
import { startNewChat, deleteChat } from "@/lib/chat";
import { useSetAtom, useAtomValue } from "jotai";
import {
  currentChatIdAtom,
  llmModelAtom,
  messagesAtom,
  userIdAtom,
} from "@/atoms/chat";

type DeleteChatButtonProps = {
  chat_session_id: string;
  chat_title: string | null;
};

export default function DeleteChatButton({
  chat_session_id,
  chat_title,
}: DeleteChatButtonProps) {
  const userId = useAtomValue(userIdAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const SetLlmModel = useSetAtom(llmModelAtom);

  return (
    <>
      <button
        type="button"
        title="Delete chat"
        className="text-gray-300 hover:text-destructive ml-auto mr-1"
        onClick={async () => {
          await deleteChat(chat_session_id);
          const newChat = await startNewChat(userId);
          if (newChat) {
            setMessages(newChat.messages);
            setCurrentChatId(newChat.chatSessionId);
            SetLlmModel("o3-mini"); // LLMモデルの初期値
          }
        }}
      >
        {chat_title !== "New Chat" && <Trash2 size={16} />}
      </button>
    </>
  );
}
