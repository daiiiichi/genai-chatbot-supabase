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
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AppHeader />
      <AppMain />
    </>
  );
}
