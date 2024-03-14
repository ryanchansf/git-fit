"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { AvatarImage } from "../../components/ui/avatar";
import { useSession } from "next-auth/react";
import Unauthorized from "@/components/unauthorized";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const email = session?.user?.email;

  const handleLogout = async () => {
    console.log("Logging out");
    await signOut();
  };

  const [workoutsCount, setWorkoutsCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await fetch(`/api/profile?username=${username}`)
          .then((response) => response.json())
          .then((message) => message.data);
        const { workouts, followers, following } = response;
        setWorkoutsCount(workouts);
        setFollowersCount(followers);
        setFollowingCount(following);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    }
    fetchProfileData();
  }, [username]);

  return (
    <div>
      {session ? (
        <Card className="flex flex-col border-none items-center justify-center gap-3 py-5 px-10">
          <div className="flex flex-col items-center justify-center gap-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://source.unsplash.com/random/200x200/?fitness" />
              <AvatarFallback>
                {username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-row items-center gap-2">
              <h1 className="font-bold text-5xl">{username}</h1>
            </div>
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-2xl">{email}</h1>
            </div>
          </div>
          <Separator className="my-4 sm:w-2/3" />

          <div className="flex sm:w-1/2 justify-between">
            <div className="flex flex-col items-center">
              <h1 className="font-bold text-4xl">{workoutsCount}</h1>
              <p className="text-lg">Workouts</p>
            </div>
            <Link href="/friends">
              <div className="flex flex-col items-center">
                <h1 className="font-bold text-4xl">{followersCount}</h1>
                <p className="text-lg">Followers</p>
              </div>
            </Link>
            <Link href="/friends">
              <div className="flex flex-col items-center">
                <h1 className="font-bold text-4xl">{followingCount}</h1>
                <p className="text-lg">Following</p>
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center hover:-translate-y-[2px]">
            <Button
              variant="link"
              onClick={() => handleLogout()}
              data-testid="logout-button"
            >
              <i
                className="fa-solid fa-arrow-right-from-bracket fa-2x"
                style={{ color: "hsl(var(--accent))" }}
              />
            </Button>
            <h1>Log out</h1>
          </div>
        </Card>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
