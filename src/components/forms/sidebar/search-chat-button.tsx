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
                    setCurrentChatId(data.chat_session_id);
                    const selectedChat = await selectChat(data.chat_session_id);
                    if (selectedChat) {
                      setMessages(selectedChat.messages);
                      SetLlmModel(selectedChat.latestLlmModel!);
                    }
                    setSearchDialogOpen(false);
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
