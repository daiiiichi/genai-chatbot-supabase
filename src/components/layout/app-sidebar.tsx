"use client";

import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";

import { usePathname } from "next/navigation";
import { useSetAtom, useAtomValue } from "jotai";
import { chatHistoriesAtom, currentChatIdAtom, userIdAtom } from "@/atoms";
import { loadChatHistories } from "@/lib/api/history/load-chat-histories";
import NewChatButton from "../forms/sidebar/new-chat-button";
import SearchChatButton from "../forms/sidebar/search-chat-button";
import DeleteAllChatsButton from "../forms/sidebar/delete-all-chats-button";
import ChatHistoryList from "../forms/sidebar/chat-history-list";

export default function AppSidebar() {
  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const currentChatId = useAtomValue(currentChatIdAtom);
  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    const fetchHistories = async (user_id: string) => {
      const histories = await loadChatHistories(user_id);
      setChatHistories(histories);
    };
    if (userId) {
      fetchHistories(userId);
    }
  }, [currentChatId, userId, setChatHistories]);

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col h-screen">
        {/* チャット管理機能（新規作成、検索、削除） */}
        <SidebarGroup>
          <SidebarGroupLabel>genai-chatbot</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NewChatButton />
              <SearchChatButton />
              <DeleteAllChatsButton />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* チャット履歴 */}
        <SidebarGroup className="flex-1 overflow-hidden">
          <SidebarGroupLabel>chat</SidebarGroupLabel>
          <SidebarGroupContent className="h-full">
            <div className="h-full overflow-y-auto pr-2 pb-8">
              <SidebarMenu>
                <ChatHistoryList />
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
