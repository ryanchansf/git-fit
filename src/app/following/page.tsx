"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Following() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const router = useRouter();

  const getfollowingData = useCallback(async () => {
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
      // console.log("Response Data:", responseData);

      if (responseData.data && Array.isArray(responseData.data)) {
        for (const obj of responseData.data) {
          console.log("obj: ", obj);
          newFollowing.push({
            img: "hgsdfaj",
            username: obj.following,
          });
        }
      }

      setfollowingData(newFollowing);
    } catch (error) {
      console.error("Error fetching followering data:", error);
    }
  }, [username]);

  const [followingData, setfollowingData] = useState<
    { img: string; username: string }[]
  >([]);
  const [followingChange, setfollowingChange] = useState(0);

  useEffect(() => {
    if (session) {
      getfollowingData();
    }
  }, [session, getfollowingData, followingChange]);

  async function handleDeleteClick(remove_user: any) {
    console.log(username, " no longer wants to follow ", remove_user);
    const message = {
      following: remove_user,
    };
    const promise = await fetch(
      `/api/following?username=${encodeURIComponent(username || "")}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      },
    );
    //  console.log("made it back from api call");
    setfollowingChange(followingChange + 1);
    return promise;
  }

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
                <Button
                  type="submit"
                  onClick={() => router.push(`/profile/${following.username}`)}
                >
                  <i style={{ color: "hsl(var(--primary)" }} />
                  <span style={{ color: "hsl(var(--accent))" }}>
                    {following.username}
                  </span>
                </Button>
              </div>
              <div style={{ marginLeft: "25px" }}>
                <Button className="bg-accent" size="icon">
                  <i
                    className="fa-solid fa-trash"
                    style={{ color: "hsl(var(--primary))" }}
                    onClick={() => handleDeleteClick(following.username)}
                  />
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
