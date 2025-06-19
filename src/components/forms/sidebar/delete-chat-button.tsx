import { Trash2 } from "lucide-react";
import { startNewChat, deleteChat } from "@/lib/chat";
import { useSetAtom, useAtomValue } from "jotai";
import { currentChatIdAtom, messagesAtom, userIdAtom } from "@/atoms/chat";

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

  return (
    <>
      <button
        type="button"
        title="Delete chat"
        className="text-gray-300 hover:text-destructive ml-auto mr-1"
        onClick={async () => {
          await deleteChat(chat_session_id);
          await startNewChat(userId, setMessages, setCurrentChatId);
        }}
      >
        {chat_title !== "New Chat" && <Trash2 size={16} />}
      </button>
    </>
  );
}
