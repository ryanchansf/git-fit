"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Session } from "next-auth";
import Unauthorized from "@/components/unauthorized";

type Props = { username: string; session: Session };

function Following({ username, session }: Props) {
  const getFollowingData = useCallback(async () => {
    try {
      const newFollowing = [];
      const response = await fetch(
        `/api/following?username=${encodeURIComponent(username || "")}`,
      );
      if (!username) {
        redirect("/register");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch following data");
      }
      const responseData = await response.json();
      console.log("Response Data:", responseData);

      if (responseData.data && Array.isArray(responseData.data)) {
        for (const obj of responseData.data) {
          console.log("obj: ", obj);
          newFollowing.push({
            img: "hgsdfaj",
            username: obj.following,
          });
        }
      }

      setFollowingData(newFollowing);
    } catch (error) {
      console.error("Error fetching followering data:", error);
    }
  }, [username]);

  const [followingData, setFollowingData] = useState<
    { img: string; username: string }[]
  >([]);

  useEffect(() => {
    if (session) {
      getFollowingData();
    }
  }, [session, getFollowingData]);
  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex justify-between px-100"
        style={{ marginBottom: "20px" }}
      >
        <h1 className="text-4xl font-bold">Following</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 px-20">
        {followingData.map(
          (following: { img: string; username: string }, index: number) => (
            <div
              className="flex items-center"
              style={{ marginBottom: "20px" }}
              key={index}
            >
              <div style={{ marginRight: "15px" }}>
                <Avatar>
                  <AvatarImage src={following.img} />
                  <AvatarFallback
                    className="bg-white"
                    style={{ color: "hsl(var(--accent))" }}
                  >
                    {following.username[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div style={{ marginLeft: "25px" }}>
                <Button type="submit">
                  <i style={{ color: "hsl(var(--primary)" }} />
                  <span style={{ color: "hsl(var(--accent))" }}>
                    {following.username}
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
function Followers({ username, session }: Props) {
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
      console.log("Response Data:", responseData);

      if (responseData.data && Array.isArray(responseData.data)) {
        for (const obj of responseData.data) {
          console.log("obj: ", obj);
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
export default function Friends() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  return (
    <div>
      {username ? (
        <div className="flex">
          <div className="flex-1">
            <Followers username={username} session={session} />
          </div>
          <div className="flex-1">
            <Following username={username} session={session} />
          </div>
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
