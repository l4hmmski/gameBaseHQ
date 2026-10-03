"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] =
    useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setIsChecking(false);
    }

    checkUser();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!session) {
            router.replace("/login");
          }
        },
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (isChecking) {
    return (
      <main
        className="
          flex min-h-[calc(100vh-73px)]
          items-center justify-center
        "
      >
        <p className="font-medium text-gray-800">
          Checking your account...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}