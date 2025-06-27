"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../components/layout/app-header";
import AppMain from "../components/layout/app-main";
import AppSidebar from "../components/layout/app-sidebar";
import useAuth from "../hooks/use-auth";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // sessionがnullのときのみリダイレクト
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  // sessionがundefinedならローディング
  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-h-screen">
          <AppHeader />
          <AppMain />
        </div>
      </div>
    </SidebarProvider>
  );
}
