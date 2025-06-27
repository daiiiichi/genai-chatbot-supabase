"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../components/layout/app-header";
import AppMain from "../components/layout/app-main";
import AppSidebar from "../components/layout/app-sidebar";
import useAuth from "../hooks/use-auth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  // session が undefined または null ならローディング画面
  if (session === undefined || session === null) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Spinner size={"large"}>Loading...</Spinner>
      </div>
    );
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
