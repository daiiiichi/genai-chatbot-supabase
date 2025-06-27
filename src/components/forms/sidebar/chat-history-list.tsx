import { SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar";
import { selectChat } from "@/lib/api/chat/select-chat";
import { cn, toJST } from "@/lib/utils";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import {
  chatHistoriesAtom,
  currentChatIdAtom,
  llmModelAtom,
  messagesAtom,
} from "@/atoms";
import DeleteChatButton from "./delete-chat-button";
import { DEFAULT_LLM_MODEL } from "@/constants/llm-model-list";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function ChatHistoryList() {
  const setMessages = useSetAtom(messagesAtom);
  const [currentChatId, setCurrentChatId] = useAtom(currentChatIdAtom);
  const chatHistories = useAtomValue(chatHistoriesAtom);
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
  };

  if (chatHistories.length === 0) {
    return (
      <div className="mt-4">
        <Spinner className="text-primary" />;
      </div>
    );
  }

  return (
    <>
      {chatHistories
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
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
                onClick={() => handleSelectChat(data.chat_session_id)}
              >
                <a className="grid !p-1 !gap-1">
                  <span className="text-xs">{toJST(data.updated_at)}</span>
                  <strong className="text-md">{data.title}</strong>
                </a>
                <DeleteChatButton
                  chat_session_id={data.chat_session_id}
                  chat_title={data.title}
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </>
  );
}
