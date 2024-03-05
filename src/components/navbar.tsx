"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Navbar() {
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
        <Link href="/friends">
          <Button variant="link">
            <i
              className="fa-solid fa-user-group fa-2x"
              style={{ color: "hsl(var(--accent))" }}
            />
          </Button>
        </Link>
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
    </div>
  );
}
