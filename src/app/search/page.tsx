//TODO: get backend working, display search results in pop up
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // const [open, setOpen] = React.useState(false);
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
