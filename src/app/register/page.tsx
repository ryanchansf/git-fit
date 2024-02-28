"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthCard } from "@/components/authCard";

export default function Login() {
  const { data: session } = useSession();
  console.log("Session on login page: ", session);
  if (session?.user?.email) {
    console.log("User already logged in: ", session);
    redirect("/");
  }

  return <AuthCard />;
}
