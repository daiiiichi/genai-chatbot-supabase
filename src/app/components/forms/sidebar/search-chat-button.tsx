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
  messagesAtom,
} from "@/app/atoms/chat";
import { selectChat } from "@/app/lib/chat";

export default function SearchChatButton() {
  const [open, setOpen] = useState(false);
  const chatHistories = useAtomValue(chatHistoriesAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a onClick={() => setOpen(true)}>
          <Search />
          <span>Search Chat</span>
        </a>
      </SidebarMenuButton>
      <CommandDialog open={open} onOpenChange={setOpen}>
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
                  onSelect={() => {
                    selectChat(
                      data.chat_session_id,
                      setCurrentChatId,
                      setMessages
                    );
                    setOpen(false);
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
