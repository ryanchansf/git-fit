"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Session } from "next-auth";
import Unauthorized from "@/components/unauthorized";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = { username: string; session: Session };

export function Following() {
  const { data: session } = useSession();
  const username = session?.user?.name;

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
                <Button type="submit">
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

function Search() {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
  const [searchResults, setSearchResults] = useState<any[]>([]); // State to hold the search results
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    async function handleChange(username: string) {
      try {
        console.log("searching for: ", username);

        const response = await fetch(
          `/api/search_users?username=${encodeURIComponent(username)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const searchData = await response.json(); // Parse response data as JSON
        setSearchResults(searchData.data); // Assuming the response contains data field with search results
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }

    if (searchQuery.trim() !== "") {
      handleChange(searchQuery);
    } else {
      setSearchResults([]);
    }
    console.log("searchQuery: ", searchQuery);
  }, [searchQuery]);

  // Log searchResults whenever it changes
  useEffect(() => {
    console.log("searchResults: ", searchResults);
  }, [searchResults]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between px-100">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent" size="lg">
              <i
                className="fa-solid fa-plus"
                style={{ color: "hsl(var(--primary))" }}
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Search Users</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="username" className="sr-only">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter Username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-24 overflow-auto">
              {searchResults &&
                searchResults.length > 0 &&
                searchResults.map((result, index) => (
                  <div
                    className="flex items-center"
                    style={{ marginBottom: "20px" }}
                    key={index}
                  >
                    <div style={{ marginRight: "15px" }}>
                      <Avatar>
                        <AvatarImage src="fskjfalksf" />
                        <AvatarFallback
                          className="bg-white"
                          style={{ color: "hsl(var(--accent))" }}
                        >
                          {result.username[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div style={{ marginLeft: "25px" }}>
                      <Button type="submit">
                        <i style={{ color: "hsl(var(--primary))" }} />
                        <span style={{ color: "hsl(var(--accent))" }}>
                          {result.username}
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </DialogContent>
        </Dialog>
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
          <div>
            <Search />
          </div>
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
