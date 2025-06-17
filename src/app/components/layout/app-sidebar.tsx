"use client";

import { useEffect } from "react";
import { Trash2, FilePlus2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { usePathname } from "next/navigation";
import { useSetAtom, useAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  messagesAtom,
} from "@/app/atoms/chat";
import { fetchChatHistories } from "@/app/lib/chat-histories";
import { startNewChat, selectChat, deleteChat } from "@/app/lib/chat";
import useAuth from "@/app/hooks/use-auth";
import { toJST } from "@/app/lib/utils";

export default function AppSidebar() {
  // ログイン画面の場合、サイドバーを表示させない設定
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/login");

  const [chatHistories, setChatHistories] = useAtom(chatHistoriesAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const setMessages = useSetAtom(messagesAtom);
  const { session } = useAuth();

  useEffect(() => {
    const fetchHistories = async () => {
      const histories = await fetchChatHistories();
      setChatHistories(histories);
    };
    fetchHistories();
  });

  return (
    showSidebar && (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>genai-chatbot</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a
                      onClick={async () => {
                        await startNewChat(
                          session,
                          setMessages,
                          setCurrentChatId
                        );
                        const data = await fetchChatHistories();
                        setChatHistories(data);
                      }}
                    >
                      <FilePlus2 />
                      <span>New Chat</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>chat</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatHistories
                  .sort(
                    (a, b) =>
                      new Date(b.updated_at).getTime() -
                      new Date(a.updated_at).getTime()
                  )
                  .map((data) => (
                    <SidebarMenuItem key={data.chat_session_id}>
                      <SidebarMenuButton asChild>
                        <div
                          className={`h-auto ${
                            currentChatId === data.chat_session_id
                              ? "bg-gray-100 dark:bg-neutral-800"
                              : ""
                          }`}
                          onClick={() =>
                            selectChat(
                              data.chat_session_id,
                              setCurrentChatId,
                              setMessages
                            )
                          }
                        >
                          <a className="grid !p-1 !gap-1">
                            <span className="text-xs">
                              {toJST(data.updated_at)}
                            </span>
                            <strong className="text-md">{data.title}</strong>
                          </a>
                          <button
                            type="button"
                            title="Delete chat"
                            className="text-gray-300 hover:text-primary ml-auto"
                            onClick={() =>
                              deleteChat(
                                data.chat_session_id,
                                session,
                                setMessages,
                                setCurrentChatId
                              )
                            }
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
  );
}
