import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { FilePlus2 } from "lucide-react";
import { startNewChat } from "@/app/lib/chat";
import { useSetAtom, useAtomValue } from "jotai";
import { currentChatIdAtom, messagesAtom, userIdAtom } from "@/app/atoms/chat";

export default function NewChatButton() {
  const userId = useAtomValue(userIdAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a
          onClick={async () => {
            await startNewChat(userId, setMessages, setCurrentChatId);
          }}
        >
          <FilePlus2 />
          <span>New Chat</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
