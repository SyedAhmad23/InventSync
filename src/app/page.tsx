"use client";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useConfig } from "@/app/config/hooks";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { userToken } = useConfig();

  useEffect(() => {
    if (!userToken) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
  }, [router, userToken]);

  return <div></div>;
}
