import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { FilePlus2 } from "lucide-react";
import { startNewChat } from "@/lib/chat";
import { useSetAtom, useAtomValue } from "jotai";
import {
  currentChatIdAtom,
  llmModelAtom,
  messagesAtom,
  userIdAtom,
} from "@/atoms";

export default function NewChatButton() {
  const userId = useAtomValue(userIdAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const SetLlmModel = useSetAtom(llmModelAtom);

  const handleNewChat = async () => {
    const newChat = await startNewChat(userId);
    if (newChat) {
      setMessages(newChat.messages);
      setCurrentChatId(newChat.chatSessionId);
      SetLlmModel("o3-mini"); // LLMモデルの初期値
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a onClick={handleNewChat}>
          <FilePlus2 />
          <span>New Chat</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
