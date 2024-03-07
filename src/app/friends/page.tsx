"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { SessionProvider } from "next-auth/react";
import { NextResponse } from "next/server";
import Following from "../following/page";
import Followers from "../followers/page";

export default function Friends() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Following />
      </div>
      <div className="flex-1">
        <Following />
      </div>
    </div>
  );
}
