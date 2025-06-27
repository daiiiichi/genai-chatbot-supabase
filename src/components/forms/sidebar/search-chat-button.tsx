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
} from "@/atoms";
import { selectChat } from "@/lib/api/chat/select-chat";
import { DEFAULT_LLM_MODEL } from "@/constants/llm-model-list";
import { useRouter } from "next/navigation";

export default function SearchChatButton() {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const chatHistories = useAtomValue(chatHistoriesAtom);
  const setMessages = useSetAtom(messagesAtom);
  const setCurrentChatId = useSetAtom(currentChatIdAtom);
  const SetLlmModel = useSetAtom(llmModelAtom);
  const router = useRouter();

  const handleSelectChat = async (chatId: string) => {
    router.push(`/?chatId=${chatId}`);
    setCurrentChatId(chatId);
    const selectedChat = await selectChat(chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      SetLlmModel(selectedChat.latestLlmModel ?? DEFAULT_LLM_MODEL);
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
