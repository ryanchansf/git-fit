"use client";

import { CreateAccount } from "@/components/createAccountCard";
import { LoginCard } from "@/components/loginCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

export function AuthCard() {
  const [tab, setTab] = useState("login");

  return (
    <main>
      <div className="flex items-center justify-center min-h-screen">
        <Tabs defaultValue={tab} className="w-[400px]" value={tab}>
          <TabsList className="flex justify-center">
            <TabsTrigger
              id="login"
              value="login"
              className="text-secondary bg-white hover:bg-secondary hover:text-white rounded-full"
              onClick={() => setTab("login")}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              id="register"
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
