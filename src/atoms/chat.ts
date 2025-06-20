import { atom } from "jotai";
import { Message } from "../types/chat";
import type { Database } from "../../database.types";

const currentChatIdAtom = atom<string>("");
const messagesAtom = atom<Message[]>([]);
const chatHistoriesAtom = atom<
  Database["public"]["Tables"]["chat_sessions"]["Row"][]
>([]);
const isLoadingAtom = atom<boolean>(false);
const streamedAnswerAtom = atom<string>("");
const userIdAtom = atom<string>("");
const llmModelAtom = atom<{ value: string; api_version: string }>({
  value: "o3-mini",
  api_version: "2024-12-01-preview",
});
const llmComboboxOpenAtom = atom<boolean>(false);

export {
  currentChatIdAtom,
  messagesAtom,
  chatHistoriesAtom,
  isLoadingAtom,
  streamedAnswerAtom,
  userIdAtom,
  llmModelAtom,
  llmComboboxOpenAtom,
};
