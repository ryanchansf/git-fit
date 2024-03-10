"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GetSessionParams, getSession, signOut } from "next-auth/react";
import { AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Unauthorized from "@/components/unauthorized";
import Link from "next/link";

export default function FriendPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();

  const [workouts, setWorkouts] = useState<Object[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const cardData: Object[] = [];
      try {
        const response = await fetch(`/api/workouts?username=${params.slug}`)
          .then((response) => response.json())
          .then((message) => {
            // Order by workout ID, newest first
            if (message.data) {
              for (const obj of message.data.sort(
                (a: any, b: any) => b.w_id - a.w_id,
              )) {
                cardData.push({
                  title: `#${obj.w_id}: ${obj.w_name}`,
                  description: `Difficulty: ${obj.difficulty}`,
                  time: `Total time: ${obj.duration} min`,
                  exercises: [
                    { name: "Bench Press", sets: "4x8", rest: "2 min" },
                    { name: "Overhead Press", sets: "4x8", rest: "2 min" },
                    { name: "Tricep Extension", sets: "4x8", rest: "2 min" },
                    { name: "Tricep Dips", sets: "4x8", rest: "2 min" },
                    { name: "Lateral Raises", sets: "4x8", rest: "2 min" },
                  ],
                });
              }
            }
          });
        setWorkouts(cardData);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, [params.slug]);

  const username = session?.user?.name;
  const email = session?.user?.email;

  return (
    <div>
      {session?.user?.email ? (
        <div className="flex flex-col gap-10">
          <Card className="flex flex-col border-none items-center justify-center gap-3 py-5 px-10">
            <div className="flex flex-col items-center justify-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://source.unsplash.com/random/200x200/?fitness" />
                <AvatarFallback>
                  {username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-row items-center gap-2">
                <h1 className="font-bold text-5xl">{params.slug}</h1>
              </div>
            </div>
            <Separator className="my-4 sm:w-2/3" />

            <div className="flex sm:w-1/2 justify-between">
              <div className="flex flex-col items-center">
                <h1 className="font-bold text-4xl">4</h1>
                <p className="text-lg">Workouts</p>
              </div>
              <Link href="/friends">
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-4xl">2</h1>
                  <p className="text-lg">Followers</p>
                </div>
              </Link>
              <Link href="/friends">
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-4xl">2</h1>
                  <p className="text-lg">Following</p>
                </div>
              </Link>
            </div>
          </Card>
          <Card className="flex flex-col border-none items-center justify-center gap-3 py-5 px-10">
            <div className="flex flex-col items-center justify-center gap-3">
              <h1 className="font-bold text-3xl">Workouts</h1>
            </div>
            <Separator className="my-4 sm:w-2/3" />
            {workouts.length === 0 ? (
              <h1 className="text-2xl text-center">
                This user doesn&apos;t have any workouts yet!
              </h1>
            ) : (
              <div className="grid grid-cols-3 gap-4 px-20">
                {workouts.map((card: any, index: any) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{card.title}</CardTitle>
                      </div>
                      <CardDescription>{card.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-lg font-medium leading-none">
                            Exercises
                          </p>
                          {card.exercises.map(
                            (exercise: any, exerciseIndex: any) => (
                              <div key={exerciseIndex} className="flex gap-3">
                                <p>
                                  {exerciseIndex + 1}. {exercise.name}
                                </p>
                                <p>{exercise.sets}</p>
                                <p>{exercise.rest} rest</p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium leading-none">
                          {card.time}
                        </p>
                        <p className="text-sm font-medium leading-none"></p>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
