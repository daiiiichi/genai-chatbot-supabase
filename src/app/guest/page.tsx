"use client";

import AppMain from "@/components/layout/app-main";
import Image from "next/image";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Command,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  FilePlus2,
  Search,
  Trash2,
  ChevronsUpDownIcon,
  CheckIcon,
  User,
  AlertCircleIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { sampleChatHistories } from "@/constants/guest-sample-chat-histories";
import { useRouter } from "next/navigation";
import { cn, toJST } from "@/lib/utils";
import { Message } from "@/types/chat";
import { sampleMessages } from "@/constants/guest-sample-messages";
import useAuth from "@/hooks/use-auth";

export default function GuestPage() {
  const [loading, setLoading] = useState(true);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const { signInWithGithub } = useAuth();
  const llmModel = "o3-mini";

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

  const modelList = [
    {
      value: "o3-mini",
      label: "gpt-o3-mini",
      logo: "/icons/openai-logo.svg",
    },
  ];

  const selectedModel = modelList.find((model) => model.value === llmModel);

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

        {/* メイン */}
        <div className="flex flex-col flex-1 min-h-screen">
          <div className="sticky top-0 z-50 flex flex-col">
            {/* ヘッダー */}
            <header className="bg-background/50 flex h-14 items-center gap-3 px-4 backdrop-blur-xl lg:h-[60px]">
              {/* サイドバー開閉ボタン */}
              <SidebarTrigger />
              {/* <Alert variant="destructive" className="w-auto">
                <AlertCircleIcon />
                <AlertTitle>Guest Mode</AlertTitle>
              </Alert> */}
              {/* LLMモデル選択 */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[216px] justify-between"
                  >
                    {selectedModel ? (
                      <div className="flex items-center">
                        <Image
                          src={selectedModel.logo}
                          alt=""
                          width={16}
                          height={16}
                          className="mr-3"
                        />
                        {selectedModel.label}
                      </div>
                    ) : (
                      "Select LLM model..."
                    )}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[216px] p-0">
                  <Command>
                    <CommandInput placeholder="Search LLM model..." />
                    <CommandList>
                      <CommandEmpty>No LLM model found.</CommandEmpty>
                      <CommandGroup>
                        {modelList.map((model) => (
                          <CommandItem
                            key={model.value}
                            value={model.value}
                            onSelect={() => {}}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                llmModel === model.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <Image
                              src={model.logo}
                              alt=""
                              width={16}
                              height={16}
                              className="mr-1"
                            />
                            {model.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* ユーザー情報 */}
              <div className="ml-auto flex gap-4">
                <Button variant="outline" onClick={signInWithGithub}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  Login with GitHub for full access
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage />
                      <AvatarFallback className="bg-primary">
                        <User className="text-white" />
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-2 w-72">
                    <DropdownMenuItem className="py-3">
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-1 flex flex-col">
                        <p className="text-sm font-medium">Guest</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
          </div>
          <AppMain />
        </div>
      </div>
    </SidebarProvider>
  );
}
