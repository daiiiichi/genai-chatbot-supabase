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
import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { Trash2 } from "lucide-react";
import { startNewChat } from "@/lib/api/chat/start-new-chat";
import { deleteAllChats } from "@/lib/api/history/delete-all-chats";
import { useSetAtom, useAtomValue } from "jotai";
import {
  currentChatIdAtom,
  llmModelAtom,
  messagesAtom,
  userIdAtom,
} from "@/atoms";
import { DEFAULT_LLM_MODEL } from "@/constants/llm-model-list";

export default function DeleteAllChatsButton() {
  const userId = useAtomValue(userIdAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const SetLlmModel = useSetAtom(llmModelAtom);

  const handleDeleteAllChats = async () => {
    await deleteAllChats(userId);
    const newChat = await startNewChat(userId);
    if (newChat) {
      setMessages(newChat.messages);
      setCurrentChatId(newChat.chatSessionId);
      SetLlmModel(DEFAULT_LLM_MODEL);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Dialog>
          <DialogTrigger asChild>
            <a className="flex w-full items-center gap-2 rounded-md p-2 text-left outline-hidden hover:bg-sidebar-accent hover:text-destructive h-8 text-sm">
              <Trash2 size={16} />
              <span>Delete All Chats</span>
            </a>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete All Chats Messages</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete all chats? This
                action cannot be undone.
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
                  onClick={handleDeleteAllChats}
                >
                  Delete
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
