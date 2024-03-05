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

// const followerData = [
//   {
//     img: "https://spiritdogtraining.com/wp-content/uploads/2021/01/mini-goldendoodle.jpg",
//     user_name: "ananya_cool",
//   },
//   {
//     img: "https://media.licdn.com/dms/image/C5603AQGoNK4iqKLkJQ/profile-displayphoto-shrink_800_800/0/1619014750840?e=2147483647&v=beta&t=shtQoIP58TlkxLDlBU--ndMdXKdy-9DE9iOw_8AsP1U",
//     user_name: "felicia_pilates",
//   },
//   {
//     img: "",
//     user_name: "caroline_calves",
//   },
// ];

export default function Followers() {
  const { data: session } = useSession();
  const username = session?.user?.name;

  const getfollowerData = useCallback(async () => {
    try {
      const newFollowing = [];
      const response = await fetch(
        `/api/followers?username=${encodeURIComponent(username)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch follower data");
      }
      const responseData = await response.json();
      console.log("Response Data:", responseData);

      // Assuming the structure of responseData is { followers: [{ username: string, ...otherProperties }], ...otherProperties }
      if (responseData.followers && Array.isArray(responseData.followers)) {
        for (const obj of responseData.followers) {
          if (obj.username === username) {
            newFollowing.push({
              img: "hgsdfaj", // Placeholder image for now, replace with actual image from data
              username: obj.username, // Assuming you want to use the follower's username here
            });
          }
        }
      }

      setfollowerData(newFollowing);
    } catch (error) {
      console.error("Error fetching follower data:", error);
    }
  }, [username]);

  const [followerData, setfollowerData] = useState([]);

  useEffect(() => {
    if (session) {
      getfollowerData();
    }
  }, [session, getfollowerData]);
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
                {/* Assuming your Avatar component works as expected */}
                <Avatar>
                  <AvatarImage src={follower.img} />
                  <AvatarFallback style={{ color: "white" }}>
                    {follower.username[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div style={{ marginLeft: "25px" }}>
                {/* Assuming your Button component works as expected */}
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

//   try {
//     const response = await fetch(`/api/followers`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch follower data");
//     }
//     const data = await response.json();

//     const newFollowing: { img: string; username: string }[] = [];
//     for (const obj of data.following) {
//       newFollowing.push({
//         img: "jsfkjfsl", // Placeholder image for now, replace with actual image from data
//         username: obj.follower,
//       });
//     }
//     setfollowerData(newFollowing);
//   } catch (error) {
//     console.error("Error fetching follower data:", error);
//   }
// }
