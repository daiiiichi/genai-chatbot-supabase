"use client";

/**
 * Guest Chat Page
 * このファイルはゲスト用チャットデモページです。
 * ログインなしでチャット機能を簡易的に試せるよう、
 * あえてこの1ファイルで完結する構成にしています。
 * 本番コードは責務ごとに分離されています。
 */

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import FileUploadButton from "@/components/ui/file-upload-button";
import {
  FilePlus2,
  Search,
  Trash2,
  ChevronsUpDownIcon,
  CheckIcon,
  User,
  AlertCircleIcon,
  CircleCheckBig,
  ArrowUp,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { sampleChatHistories } from "@/constants/guest-sample-chat-histories";
import { useRouter } from "next/navigation";
import { cn, toJST } from "@/lib/utils";
import { Message } from "@/types/chat";
import { sampleMessages } from "@/constants/guest-sample-messages";
import useAuth from "@/hooks/use-auth";
import { sampleList } from "@/components/forms/main/sumple-prompt";
import { sendMessageToLLM } from "@/lib/api/answer/send-message-to-llm";
import MarkdownDisplay from "@/components/ui/markdown-display";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import generateChatTitle from "@/lib/api/chat/generate-chat-title";
import { v4 as uuidv4 } from "uuid";

export default function GuestPage() {
  const [chatHistoriesLoading, setChatHistoriesLoading] = useState(true);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLlmLoading, setIsLlmLoading] = useState(false);
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const [chatHistories, SetChatHistories] = useState(sampleChatHistories);
  const router = useRouter();
  const { signInWithGithub } = useAuth();
  const llmModel = "o3-mini";
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChatHistoriesLoading(false);
    }, 1500);

    const newChatId = uuidv4();

    const newChat = {
      chat_session_id: newChatId,
      created_at: new Date().toISOString(),
      title: "New Chat",
      updated_at: new Date().toISOString(),
    };
    SetChatHistories((prev) => [...prev, newChat]);
    sampleMessages.push({
      chat_session_id: newChatId,
      messages: [],
    });
    setCurrentChatId(newChatId);
    const selectedChatMessages =
      sampleMessages.find((chat) => chat.chat_session_id === newChatId)
        ?.messages || [];
    if (selectedChatMessages) {
      setMessages(selectedChatMessages);
      console.log(selectedChatMessages);
    }
    router.push(`/guest/?chatId=${newChatId}`);
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
      console.log(selectedChatMessages);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const generateChatTitle = async (
    assistantMessage: Message
  ): Promise<string> => {
    try {
      const res = await fetch("/api/guest/generate-title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate title");
      }

      const data = await res.json();
      return data.title as string;
    } catch (err) {
      console.error("タイトル生成に失敗しました:", err);
      return "タイトル生成に失敗しました";
    }
  };

  const sendMessage = async () => {
    // ユーザーメッセージの成型とメッセージ送信時の前準備
    const userMessageObj: Message = {
      role: "user",
      content: userInput,
      llm_model: null,
    };
    const addUserMessages: Message[] = [...messages, userMessageObj];
    setMessages(addUserMessages);
    const currentMesaages = sampleMessages.find(
      (s) => s.chat_session_id === currentChatId
    );

    currentMesaages?.messages.push(userMessageObj);
    setStreamedAnswer("");
    setIsLlmLoading(true);
    setUserInput("");

    try {
      const answer = await sendMessageToLLM({
        messages: addUserMessages,
        modelName: llmModel,
        onChunk: (chunk) => {
          setStreamedAnswer((prev) => prev + chunk);
        },
      });

      setIsLlmLoading(false);

      const assistantAnswerObj: Message = {
        role: "assistant",
        content: answer,
        llm_model: llmModel,
      };
      const addAssistantMessages: Message[] = [
        ...addUserMessages,
        assistantAnswerObj,
      ];
      setMessages(addAssistantMessages);

      currentMesaages?.messages.push(assistantAnswerObj);

      setStreamedAnswer("");

      const newChatTitle = await generateChatTitle(assistantAnswerObj);

      const chat = chatHistories.find(
        (item) => item.chat_session_id === currentChatId
      );

      if (chat) {
        chat.title = newChatTitle;
        chat.updated_at = new Date().toISOString();

        SetChatHistories([...chatHistories]);
      }
    } catch (err: unknown) {
      console.error("チャット送信中にエラー:", err);
      alert(
        "メッセージの送信中にエラーが発生しました。\n再読み込みをしてから再度実行をお願いします。"
      );
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, streamedAnswer]);

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
                      <a onClick={() => window.location.reload()}>
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
                    {chatHistoriesLoading ? (
                      <div className="mt-4">
                        <Spinner className="text-primary" />
                      </div>
                    ) : (
                      chatHistories
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
          <div className="p-4">
            <div className="m-auto flex h-[calc(100vh-6rem)] w-full max-w-(--breakpoint-md) items-center justify-center">
              <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
                {/* ゲストモード警告表示 */}
                <Alert
                  variant="destructive"
                  className={cn(messages.length === 0 ? "" : "hidden")}
                >
                  <AlertCircleIcon />
                  <AlertTitle>Guest Mode</AlertTitle>
                  <AlertDescription>
                    <p>
                      ゲストモードでは一部の機能のみ利用可能です。GitHubでログインすると、すべての機能をご利用いただけます。
                    </p>
                    <ul className="list-inside list-disc text-sm">
                      <li>
                        会話履歴は保存されません。現在表示されている履歴はサンプルです。
                      </li>
                      <li>
                        使用可能なLLMモデルは <code>gpt-o3-mini</code>{" "}
                        のみです。ログインすると Gemini も使用可能になります。
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* チャット吹き出し */}
                <div
                  ref={chatContainerRef}
                  className={cn(
                    "flex-col overflow-y-auto relative w-full flex-1 space-y-4 pe-2",
                    messages.length > 0 ? "flex" : "hidden"
                  )}
                >
                  {messages
                    .filter((msg) => msg.role !== "system")
                    .map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex gap-3",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            msg.role === "user"
                              ? "ml-auto max-w-[75%]"
                              : "mr-auto max-w-[95%]"
                          )}
                        >
                          {/* アシスタントのメッセージにLLMモデルの種類の表示 */}
                          {msg.role === "assistant" && (
                            <Badge className="mb-1" variant={"outline"}>
                              <MessageSquare />
                              {msg.llm_model}
                            </Badge>
                          )}
                          <div
                            className={cn(
                              "break-words whitespace-pre-wrap rounded-lg px-3 py-2",
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground border"
                            )}
                          >
                            {/* アシスタントのメッセージのみマークダウン表示 */}
                            {msg.role === "assistant" ? (
                              <MarkdownDisplay content={msg.content} />
                            ) : (
                              msg.content
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* 回答生成前のインジケーター　および　ストリームで返答される回答を表示する場合 */}
                  {isLlmLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="max-w-[95%] justify-end">
                        <div className="break-words whitespace-normal rounded-lg px-3 py-2 bg-muted text-foreground border">
                          {streamedAnswer ? (
                            <MarkdownDisplay content={streamedAnswer} />
                          ) : (
                            <TypingIndicator />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* テキスト入力欄 */}
                <div className="border-input bg-background rounded-3xl border p-2 shadow-xs w-full max-w-(--breakpoint-md)">
                  <Textarea
                    className="border-none shadow-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Ask me anything..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <FileUploadButton />
                    <div className="flex gap-4">
                      <Badge variant={"outline"} style={{ cursor: "pointer" }}>
                        <CircleCheckBig />
                        {llmModel}
                      </Badge>
                      {/* 送信ボタン */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="submit"
                            onClick={sendMessage}
                            title="Send Message"
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all
            disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:shrink-0 [&_svg]:size-4 
            outline-none focus-visible:border-ring focus-visible:ring-50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
            aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 size-9 h-8 w-8 rounded-full"
                            data-state="closed"
                            disabled={!userInput.trim()}
                          >
                            <ArrowUp className="lucide lucide-arrow-up" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Send Message</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* サンプルプロンプト */}
                <div
                  className={cn(
                    "space-x-2 space-y-2 m-2",
                    messages.length > 0 ? "hidden" : ""
                  )}
                >
                  {sampleList.map((sample) => (
                    <Button
                      variant="outline"
                      key={sample.id}
                      onClick={() => setUserInput(sample.text)}
                    >
                      <sample.icon /> {sample.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
