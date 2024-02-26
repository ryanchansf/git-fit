"use client";

import { CreateAccount } from "@/components/createAccountCard";
import { LoginCard } from "@/components/loginCard";
import { Session } from "next-auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useSession } from "next-auth/react";

// interface LoginProps {
//   session: Session | null;
// }

export function AuthCard() {
  //   const [session, setSession] = useState<Session | null>(null);

  //   const { data: session, status } = useSession();
  //   console.log("Session: ", session);
  //   console.log("Status: ", status);

  const [tab, setTab] = useState("login");

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="flex justify-center">
            <TabsTrigger
              value="login"
              className="text-secondary bg-white hover:bg-secondary hover:text-white rounded-full"
              onClick={() => setTab("login")}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="text-secondary bg-white hover:bg-secondary hover:text-white rounded-full"
              onClick={() => setTab("register")}
            >
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginCard />
          </TabsContent>
          <TabsContent value="register">
            <CreateAccount setTab={setTab} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
