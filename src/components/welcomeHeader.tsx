"use client";
import { useSession } from "next-auth/react";

export default function WelcomeHeader() {
  const { data: session } = useSession();
  console.log("Session from header: ", session);
  const username = session?.user?.email;

  return <h1 className="text-4xl font-bold">Welcome back, {username}</h1>;
}
