"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import React, { useState } from "react";

export default function ProfilePage() {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [username, setUsername] = useState("user1");
  const [email, setEmail] = useState("user1@test.com");

  const handleUsernameChange = () => {
    console.log(username);
    // change username in db
    setIsEditingUsername(false);
  };

  const handleEmailChange = () => {
    console.log(email);
    // change email in db
    setIsEditingEmail(false);
  };

  return (
    <Card className="flex flex-col border-none items-center justify-center gap-3 py-5 px-10">
      <div className="flex flex-row items-center gap-2">
        {isEditingUsername ? (
          <div className="flex flex-col gap-2 items-center">
            <Input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleUsernameChange();
                }
              }}
            />
            <p>Press enter to save changes</p>
          </div>
        ) : (
          <h1 className="font-bold text-5xl">{username}</h1>
        )}
        <Button size="icon" onClick={() => setIsEditingUsername(true)}>
          <i
            className="fa-solid fa-pen-to-square fa-2x"
            style={{ color: "hsl(var(--accent))" }}
          />
        </Button>
      </div>
      <div className="flex flex-row items-center gap-2">
        {isEditingEmail ? (
          <div className="flex flex-col gap-2 items-center">
            <Input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleEmailChange();
                }
              }}
            />
            <p>Press enter to save changes</p>
          </div>
        ) : (
          <h1 className="text-2xl">{email}</h1>
        )}
        <Button size="icon" onClick={() => setIsEditingEmail(true)}>
          <i
            className="fa-solid fa-pen-to-square"
            style={{ color: "hsl(var(--accent))" }}
          />
        </Button>
      </div>
      <div className="flex sm:w-1/2 justify-between">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-4xl">4</h1>
          <p className="text-lg">Workouts</p>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-4xl">2</h1>
          <p className="text-lg">Friends</p>
        </div>
      </div>
    </Card>
  );
}
