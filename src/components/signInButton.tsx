"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

type Props = { text: string };

const SignInButton = ({ text }: Props) => {
  return (
    <Button
      variant="default"
      onClick={() => {
        signIn("google", { callbackUrl: "/" }).catch(console.error);
      }}
    >
      {text}
    </Button>
  );
};

export default SignInButton;
