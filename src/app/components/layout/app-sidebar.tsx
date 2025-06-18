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
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  userIdAtom,
} from "@/app/atoms/chat";
import { fetchChatHistories } from "@/app/lib/chat-histories";
import NewChatButton from "../forms/sidebar/new-chat-button";
import SearchChatButton from "../forms/sidebar/search-chat-button";
import DeleteAllChatsButton from "../forms/sidebar/delete-all-chats-button";
import ChatHistoryList from "../forms/sidebar/chat-history-list";

export default function AppSidebar() {
  // ログイン画面の場合、サイドバーを表示させない設定
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/login");

  const setChatHistories = useSetAtom(chatHistoriesAtom);
  const currentChatId = useAtomValue(currentChatIdAtom);
  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    const fetchHistories = async (user_id: string) => {
      const histories = await fetchChatHistories(user_id);
      setChatHistories(histories);
    };
    if (userId) {
      fetchHistories(userId);
    }
  }, [currentChatId, userId]);

  return (
    showSidebar && (
      <Sidebar>
        <SidebarContent>
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
          <SidebarGroup>
            <SidebarGroupLabel>chat</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <ChatHistoryList />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  );
}
