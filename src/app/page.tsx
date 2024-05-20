"use client"
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return <div></div>;
}