"use client";

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
import React, { useState } from "react";

type CreateAccountCardProps = {
  setTab: (value: string) => void;
};

export function CreateAccount({ setTab }: CreateAccountCardProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateAccount = async () => {
    // CHANGE THIS TO NAVIGATE TO NEW PAGE
    console.log("Email", email);
    try {
      const response = await fetch(`/api/users?username=${username}`);
      const jsonResponse = await response.json();
      const user = jsonResponse.data;

      if (user) {
        // user already exists so return
        console.log("User already exists");
        setErrorMessage("User already exists");
        return;
      } else {
        // user does not exist so create new user
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (!response.ok) {
            console.log("Error creating user:", data.message);
            setErrorMessage("Failed to create user");
            return;
          }
          console.log("User created successfully");
          setTab("login");
        } catch (error) {
          console.log("Failed to create user:", error);
        }
      }
    } catch (error) {
      console.log("Error during registration:", error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
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
            className="w-full text-white"
            onClick={handleCreateAccount}
          >
            Create account
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
