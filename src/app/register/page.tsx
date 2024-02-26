"use client";
import { CreateAccount } from "@/components/createAccountCard";
import { LoginCard } from "@/components/loginCard";
import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AuthCard } from "@/components/authCard";

// interface LoginProps {
//   session: Session | null;
// }
// import { useRouter } from "next/router";

export default function Login() {
  const { data: session } = useSession();
  console.log("Session on login page: ", session);
  if (session?.user?.email) {
    console.log("User already logged in: ", session);
    redirect("/");
  }

  //   if (status === "loading") return null; // Loading state

  return <AuthCard />;
}
