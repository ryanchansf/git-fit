"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

export default function Followers() {
  const { data: session } = useSession();
  const username = session?.user?.name;

  const getFollowerData = useCallback(async () => {
    try {
      const newFollower = [];
      const response = await fetch(
        `/api/followers?username=${encodeURIComponent(username || "")}`,
      );
      if (!username) {
        redirect("/register");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch follower data");
      }
      const responseData = await response.json();

      if (responseData.data && Array.isArray(responseData.data)) {
        for (const obj of responseData.data) {
          newFollower.push({
            img: "hgsdfaj",
            username: obj.follower,
          });
        }
      }

      setFollowerData(newFollower);
    } catch (error) {
      console.error("Error fetching follower data:", error);
    }
  }, [username]);

  const [followerData, setFollowerData] = useState<
    { img: string; username: string }[]
  >([]);

  useEffect(() => {
    if (session) {
      getFollowerData();
    }
  }, [session, getFollowerData]);
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex justify-between px-100"
        style={{ marginBottom: "20px" }}
      >
        <h1 className="text-4xl font-bold">Followers</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 px-20">
        {followerData.map(
          (follower: { img: string; username: string }, index: number) => (
            <div
              className="flex items-center"
              style={{ marginBottom: "20px" }}
              key={index}
            >
              <div style={{ marginRight: "15px" }}>
                <Avatar>
                  <AvatarImage src={follower.img} />
                  <AvatarFallback
                    className="bg-white"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    {follower.username[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div style={{ marginLeft: "25px" }}>
                <Button type="submit">
                  <i style={{ color: "hsl(var(--primary)" }} />
                  <span style={{ color: "hsl(var(--accent))" }}>
                    {follower.username}
                  </span>
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
