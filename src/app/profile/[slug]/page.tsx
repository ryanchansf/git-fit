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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Unauthorized from "@/components/unauthorized";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

function getApiUrl(path: string) {
  if (process.env.NODE_ENV === "test") {
    return `http://localhost:3000${path}`;
  } else {
    return path;
  }
}

export default function FriendPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();

  const [workouts, setWorkouts] = useState<Object[]>([]);
  const [workoutsCount, setWorkoutsCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const { toast } = useToast();
  // const username = session?.user?.name;

  const handleAddFollower = async (following: any) => {
    const message = {
      following: following,
    };
    fetch(`/api/following?username=${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.status === 500) {
          toast({
            title: "You already follow this user",
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "New following added!",
            variant: "default",
            duration: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error adding following:", error);
        toast({
          title: "Failed to add following",
          variant: "destructive",
          duration: 3000,
        });
      });
  };
  const handleAddWorkout = async (workout: any) => {
    const message = {
      username: username,
      duration: workout.time.split(" ")[2],
      difficulty: workout.description.split(" ")[1],
      tags: workout.tags,
      w_name: workout.title.split(": ")[1],
      w_id: workout.title.slice(1).split(": ")[0],
    };
    fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.status === 500) {
          toast({
            title: "Workout already exists in your list",
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Workout added to your list!",
            variant: "default",
            duration: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error adding workout:", error);
        toast({
          title: "Failed to add workout",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  // Return a list of exercise names, reps, and sets
  async function getWorkoutExercises(w_id: any) {
    const exercise_list: Object[] = [];
    await fetch(getApiUrl(`/api/workouts?w_id=${w_id}`))
      .then((response) => response.json())
      .then((message) => {
        if (message.data) {
          for (const obj of message.data) {
            exercise_list.push({
              name: obj.exercises.exercise_name,
              sets: obj.sets,
              reps: obj.reps,
            });
          }
        }
      });
    return exercise_list;
  }

  useEffect(() => {
    async function fetchWorkouts() {
      const cardData: Object[] = [];
      try {
        await fetch(getApiUrl(`/api/workouts?username=${params.slug}`))
          .then((response) => response.json())
          .then(async (message) => {
            if (message.data) {
              for (const obj of message.data.sort(
                (a: any, b: any) => b.w_id - a.w_id,
              )) {
                const data = await getWorkoutExercises(obj.w_id);
                cardData.push({
                  title: `#${obj.w_id}: ${obj.w_name}`,
                  description: `Difficulty: ${obj.difficulty}`,
                  time: `Total time: ${obj.duration} min`,
                  exercises: data,
                  tags: obj.tags,
                });
              }
              setWorkouts(cardData);
            }
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    async function fetchProfileData() {
      try {
        const response = await fetch(
          getApiUrl(`/api/profile?username=${params.slug}`),
        )
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
    fetchWorkouts();
    console.log(fetchWorkouts());
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
                <Dialog>
                  <div style={{ marginLeft: "10px" }}>
                    <DialogTrigger asChild>
                      <Button className="bg-accent" size="icon">
                        <i
                          className="fa-solid fa-plus"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                      </Button>
                    </DialogTrigger>
                  </div>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Follow Account</DialogTitle>
                      <br />
                      <div>
                        Would you like to follow{" "}
                        <span className="inline-block align-middle whitespace-nowrap max-w-[200px] overflow-auto text-red-500">
                          {params.slug}
                        </span>
                        &apos;s page?
                      </div>
                      <DialogClose asChild>
                        <Button onClick={() => handleAddFollower(params.slug)}>
                          Follow
                        </Button>
                      </DialogClose>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
              <div className="grid grid-cols-2 gap-4 px-10">
                {workouts.map((w: any, index: any) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{w.title}</CardTitle>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-accent" size="icon">
                              <i
                                className="fa-solid fa-plus"
                                style={{ color: "hsl(var(--primary))" }}
                              />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{w.title}</DialogTitle>
                              <br />
                              <div>
                                Would you like to add{" "}
                                <span className="inline-block align-middle whitespace-nowrap max-w-[200px] overflow-auto text-red-500">
                                  {params.slug}
                                </span>
                                &apos;s workout to your list?
                              </div>
                              <DialogClose asChild>
                                <Button onClick={() => handleAddWorkout(w)}>
                                  Add
                                </Button>
                              </DialogClose>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <CardDescription>{w.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-lg font-medium leading-none">
                            Exercises
                          </p>
                          {w.exercises.map(
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
                          {w.time}
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
