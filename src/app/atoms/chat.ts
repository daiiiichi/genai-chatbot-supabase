import { atom } from "jotai";
import { Message } from "../../types/chat";
import type { Database } from "../../../database.types";

const currentChatIdAtom = atom<string>("");
const messagesAtom = atom<Message[]>([]);
const chatHistoriesAtom = atom<
  Database["public"]["Tables"]["chat_sessions"]["Row"][]
>([]);
const isLoadingAtom = atom<boolean>(false);
const streamedAnswerAtom = atom<string>("");
const userIdAtom = atom<string>("");

export {
  currentChatIdAtom,
  messagesAtom,
  chatHistoriesAtom,
  isLoadingAtom,
  streamedAnswerAtom,
  userIdAtom,
};
