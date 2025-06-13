"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "./components/layout/app-header";
import AppMain from "./components/layout/app-main";
import useUser from "./hooks/use-user";

export default function Home() {
  const { session } = useUser();
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
    <>
      <AppHeader />
      <AppMain />
    </>
  );
}
