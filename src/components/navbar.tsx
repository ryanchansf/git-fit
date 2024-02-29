"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const handleLogout = async () => {
    console.log("Logging out");
    await signOut();
  };

  return (
    <div className="flex px-20 py-5 bg-primary justify-center gap-20">
      <div className="flex flex-col items-center hover:-translate-y-[2px]">
        <Link href="/">
          <Button variant="link">
            <i
              className="fa-solid fa-house fa-2x"
              style={{ color: "hsl(var(--accent))" }}
            />
          </Button>
        </Link>
        <h1>Home</h1>
      </div>
      <div className="flex flex-col items-center hover:-translate-y-[2px]">
        <Button variant="link">
          <i
            className="fa-solid fa-user-group fa-2x"
            style={{ color: "hsl(var(--accent))" }}
          />
        </Button>
        <h1>Friends</h1>
      </div>
      <div className="flex flex-col items-center hover:-translate-y-[2px]">
        <Link href="/profile">
          <Button variant="link">
            <i
              className="fa-solid fa-user fa-2x"
              style={{ color: "hsl(var(--accent))" }}
            />
          </Button>
        </Link>
        <h1>Profile</h1>
      </div>
      <div className="flex flex-col items-center hover:-translate-y-[2px]">
        <Link href="/settings">
          <Button variant="link">
            <i
              className="fa-solid fa-user fa-2x"
              style={{ color: "hsl(var(--accent))" }}
            />
          </Button>
        </Link>
        <h1>Profile</h1>
      </div>
      {session?.user?.email && (
        <div className="flex flex-col items-center hover:-translate-y-[2px]">
          <Button variant="link" onClick={() => handleLogout()}>
            <i
              className="fa-solid fa-arrow-right-from-bracket fa-2x"
              style={{ color: "hsl(var(--accent))" }}
            />
          </Button>
          <h1>Log out</h1>
        </div>
      )}
    </div>
  );
}
