import { atom } from "jotai";
import { Message } from "../types/chat";
import type { Database } from "../../database.types";
import { DEFAULT_LLM_MODEL } from "@/constants/llm-model-list";

export const currentChatIdAtom = atom<string>("");
export const messagesAtom = atom<Message[]>([]);
export const chatHistoriesAtom = atom<
  Database["public"]["Tables"]["chat_sessions"]["Row"][]
>([]);
export const streamedAnswerAtom = atom<string>("");
export const llmModelAtom = atom<string>(DEFAULT_LLM_MODEL);
