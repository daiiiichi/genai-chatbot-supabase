"use client";

import { useState } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { useAtomValue, useSetAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  llmModelAtom,
  messagesAtom,
} from "@/atoms/chat";
import { selectChat } from "@/lib/chat";

export default function SearchChatButton() {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const chatHistories = useAtomValue(chatHistoriesAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const SetLlmModel = useSetAtom(llmModelAtom);

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    const selectedChat = await selectChat(chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      SetLlmModel(selectedChat.latestLlmModel ?? "o3-mini");
    }
    setSearchDialogOpen(false);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a onClick={() => setSearchDialogOpen(true)}>
          <Search />
          <span>Search Chat</span>
        </a>
      </SidebarMenuButton>

      <CommandDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="chat">
            {chatHistories
              .sort(
                (a, b) =>
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
              )
              .map((data) => (
                <CommandItem
                  key={data.chat_session_id}
                  onSelect={async () => {
                    handleSelectChat(data.chat_session_id);
                  }}
                >
                  <span>{data.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarMenuItem>
  );
}
