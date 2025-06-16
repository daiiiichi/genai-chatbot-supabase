"use client";

import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase/supabase-client";

export default function useAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  function signInWithGithub() {
    supabase.auth.signInWithOAuth({ provider: "github" });
  }

  function signOut() {
    supabase.auth.signOut();
  }

  console.log("useAuth session:", session?.user);

  return {
    session,
    signInWithGithub,
    signOut,
  };
}
