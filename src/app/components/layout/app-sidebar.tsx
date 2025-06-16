"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
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
import { supabase } from "@/app/lib/supabase/supabase-client";

export default function AppSidebar() {
  // ログイン画面の場合、サイドバーを表示させない設定
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith("/login");

  const [chatHistories, setChatHistories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("chat_sessions").select();
      if (!error && data) {
        setChatHistories(data);
      } else {
        setChatHistories([]);
      }
    };
    fetchData();
  }, []);

  const toJST = (date: string): string => {
    const JST = new Date(date)
      .toLocaleString("ja-JP", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-")
      .replace(" ", " ");
    return JST;
  };

  const deleteChat = async (selectedChatId: string) => {
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("chat_session_id", selectedChatId);
    if (!error) {
      setChatHistories((prev) =>
        prev.filter((chat) => chat.chat_session_id !== selectedChatId)
      );
    } else {
      alert("削除に失敗しました");
    }
  };

  return (
    showSidebar && (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>genai-chatbot</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatHistories.map((data) => (
                  <SidebarMenuItem key={data.chat_session_id}>
                    <SidebarMenuButton asChild>
                      <div className="h-auto">
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
                          onClick={() => deleteChat(data.chat_session_id)}
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
