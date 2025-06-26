import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { startNewChat } from "@/lib/chat";
import { deleteChat } from "@/lib/api/chat/delete-chat";
import { useSetAtom, useAtomValue } from "jotai";
import {
  currentChatIdAtom,
  llmModelAtom,
  messagesAtom,
  userIdAtom,
} from "@/atoms";
import { DEFAULT_LLM_MODEL } from "@/constants/llm-model-list";

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

  const handleDeleteChat = async () => {
    await deleteChat(chat_session_id);
    const newChat = await startNewChat(userId);
    if (newChat) {
      setMessages(newChat.messages);
      setCurrentChatId(newChat.chatSessionId);
      SetLlmModel(DEFAULT_LLM_MODEL);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <a className="text-gray-300 hover:text-destructive ml-auto mr-1">
            {chat_title !== "New Chat" && <Trash2 size={16} />}
          </a>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion 「{chat_title}」</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message as well as all chats?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                className="ml-auto"
                onClick={handleDeleteChat}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
