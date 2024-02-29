"use client";

import React, { useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export function LoginCard() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //   const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch(`/api/users?username=${username}`);
      const jsonResponse = await response.json();
      const user = jsonResponse.data;
      let errorMessage = "";

      if (user) {
        // user exists so try to sign in with password credentials
        try {
          const res = await signIn("credentials", {
            username,
            email,
            password,
            redirect: false,
          });

          if (res && res.error) {
            errorMessage = "Invalid credentials";
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        errorMessage = "Account doesn't exist";
      }
      if (errorMessage) {
        toast({
          title: errorMessage,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Login to your GitFit account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-6">
            <Button variant="outline" className="hover:text-white">
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="username"
              placeholder="caroline_calves"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="secondary"
            className="w-full bg-accent text-white"
            onClick={() => handleLogin()}
          >
            Let&apos;s Git Fit!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
