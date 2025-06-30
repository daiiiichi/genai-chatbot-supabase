"use client";

import AppHeader from "@/components/layout/app-header";
import AppMain from "@/components/layout/app-main";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { FilePlus2, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { sampleChatHistories } from "@/constants/guest-sample-chat-histories";
import { useRouter } from "next/navigation";
import { cn, toJST } from "@/lib/utils";
import { Message } from "@/types/chat";
import { sampleMessages } from "@/constants/guest-sample-messages";

export default function GuestPage() {
  const [loading, setLoading] = useState(true);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectChat = async (chatId: string) => {
    router.push(`/guest/?chatId=${chatId}`);
    setCurrentChatId(chatId);
    const selectedChatMessages =
      sampleMessages.find((chat) => chat.chat_session_id === chatId)
        ?.messages || [];
    if (selectedChatMessages) {
      setMessages(selectedChatMessages);
    }
    setSearchDialogOpen(false);
  };
  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        {/* サイドバー */}
        <Sidebar>
          <SidebarContent className="flex flex-col h-screen">
            {/* チャット管理機能（新規作成、検索、削除） */}
            <SidebarGroup>
              <SidebarGroupLabel>Multi-Model Chatbot</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* 新規作成ボタン */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a>
                        <FilePlus2 />
                        <span>New Chat</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* チャット履歴検索ボタン */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a onClick={() => setSearchDialogOpen(true)}>
                        <Search />
                        <span>Search Chat</span>
                      </a>
                    </SidebarMenuButton>

                    <CommandDialog
                      open={searchDialogOpen}
                      onOpenChange={setSearchDialogOpen}
                    >
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="chat">
                          {sampleChatHistories
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

                  {/* チャット履歴全削除ボタン */}
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
                            <p className="text-destructive">
                              The delete function is not available in guest
                              mode.
                            </p>
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
                                disabled={true}
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

            {/* チャット履歴 */}
            <SidebarGroup className="flex-1 overflow-hidden">
              <SidebarGroupLabel>chat</SidebarGroupLabel>
              <SidebarGroupContent className="h-full">
                <div className="h-full overflow-y-auto pr-2 pb-8">
                  <SidebarMenu>
                    {loading ? (
                      <div className="mt-4">
                        <Spinner className="text-primary" />
                      </div>
                    ) : (
                      sampleChatHistories
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
                                  handleSelectChat(data.chat_session_id)
                                }
                              >
                                <a className="grid !p-1 !gap-1">
                                  <span className="text-xs">
                                    {toJST(data.updated_at)}
                                  </span>
                                  <strong className="text-md">
                                    {data.title}
                                  </strong>
                                </a>

                                {/* チャット削除ボタン */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <a className="text-gray-300 hover:text-destructive ml-auto mr-1">
                                      {data.title !== "New Chat" && (
                                        <Trash2 size={16} />
                                      )}
                                    </a>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Confirm Deletion 「{data.title}」
                                      </DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this
                                        message as well as all chats? This
                                        action cannot be undone.
                                      </DialogDescription>
                                      <p className="text-destructive">
                                        The delete function is not available in
                                        guest mode.
                                      </p>
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
                                          disabled={true}
                                        >
                                          Delete
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))
                    )}
                  </SidebarMenu>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* チャットメイン */}
        <div className="flex flex-col flex-1 min-h-screen">
          <AppHeader />
          <AppMain />
        </div>
      </div>
    </SidebarProvider>
  );
}
