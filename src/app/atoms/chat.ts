import { atom } from "jotai";
import { Message } from "../types/chat";

export const currentChatIdAtom = atom<string>("");
export const messagesAtom = atom<Message[]>([]);
export const chatHistoriesAtom = atom<any[]>([]);
