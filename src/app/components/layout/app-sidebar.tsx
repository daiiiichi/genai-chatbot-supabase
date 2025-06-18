"use client";

import { useEffect } from "react";
import { Trash2, FilePlus2, Search } from "lucide-react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

import { usePathname } from "next/navigation";
import { useSetAtom, useAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  messagesAtom,
} from "@/app/atoms/chat";
import { fetchChatHistories } from "@/app/lib/chat-histories";
import {
  startNewChat,
  selectChat,
  deleteChat,
  deleteAllChats,
} from "@/app/lib/chat";
import useAuth from "@/app/hooks/use-auth";
import { cn, toJST } from "@/app/lib/utils";

export default function AppSidebar() {
  // ログイン画面の場合、サイドバーを表示させない設定
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/login");

  const [chatHistories, setChatHistories] = useAtom(chatHistoriesAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const setMessages = useSetAtom(messagesAtom);
  const { session } = useAuth();

  useEffect(() => {
    const fetchHistories = async (user_id: string) => {
      const histories = await fetchChatHistories(user_id);
      setChatHistories(histories);
    };
    if (session?.user.id) {
      fetchHistories(session?.user.id);
    }
  }, [currentChatId, session?.user.id]);

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
                      }}
                    >
                      <FilePlus2 />
                      <span>New Chat</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a>
                      <Search />
                      <span>Search Chat</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                            Are you sure you want to permanently delete all
                            chats? This action cannot be undone.
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
                              onClick={async () => {
                                await deleteAllChats(session);
                                await startNewChat(
                                  session,
                                  setMessages,
                                  setCurrentChatId
                                );
                              }}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                          className={cn(
                            "h-auto",
                            currentChatId === data.chat_session_id &&
                              "bg-gray-100 dark:bg-neutral-800"
                          )}
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
                            className="text-gray-300 hover:text-destructive ml-auto mr-1"
                            onClick={async () => {
                              await deleteChat(data.chat_session_id);
                              await startNewChat(
                                session,
                                setMessages,
                                setCurrentChatId
                              );
                            }}
                          >
                            {data.title !== "New Chat" && <Trash2 size={16} />}
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
