"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function WelcomeHeader() {
  const { data: session } = useSession();
  const username = session?.user?.name;

  if (!username) {
    redirect("/register");
  }

  return <h1 className="text-4xl font-bold">Welcome back, {username}</h1>;
}
