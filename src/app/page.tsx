"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import connectDB from "@/database/db";
import { NextResponse } from "next/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import WelcomeHeader from "@/components/welcomeHeader";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// TODO:
// Cards:
//   - Fetch cards from database
//   - Link exercises to cards
// Add Workout popup:
//   - Use usernames when adding new workouts (From Ryan's commit)
//   - Disable "Add workout" button until form errors are corrected
//   - Clear form fields after submitting form

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Workout name must be at least 2 characters." })
    .max(20, { message: "Workout name must be less than 20 characters." }),
  duration: z
    .string()
    .min(1, { message: "Duration must be an integer greater than 0" })
    .max(3, { message: "Duration must be an integer less than 1000" })
    // Regex to detect if the input is an integer
    .refine((str) => /^\d+$/.test(str), {
      message: "Duration must be an integer",
    }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  tags: z.string().max(100, { message: "No more than 100 characters allowed" }),
});

export default function Home() {
  const { data: session } = useSession();
  const username = session?.user?.name;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficulty: "Medium",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const message = {
      username: username,
      duration: values.duration,
      difficulty: values.difficulty,
      tags: values.tags.replaceAll(" ", "").split(","),
      w_name: values.name,
    };
    const promise = await fetch("/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    //setCardData([...,message]);
    return promise;
  }

  async function getCardData() {
    const newCard: Object[] = [];
    await fetch("/api/workouts")
      .then((response) => response.json())
      .then((data) => {
        for (const obj of data.workouts) {
          if (obj.username === username) {
            newCard.push({
              title: obj.w_name,
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
    setCardData(newCard);
  }

  const [cardData, setCardData] = useState<any>([]);

  useEffect(() => {
    getCardData();
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between px-100">
        <WelcomeHeader />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent" size="lg">
              <i
                className="fa-solid fa-plus"
                style={{ color: "hsl(var(--primary))" }}
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add workout</DialogTitle>
              <DialogDescription>
                Add new workouts here. Click &quot;add workout&quot; when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kalf Killer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (min)</FormLabel>
                      <FormControl>
                        <Input placeholder="Integer 1 - 999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add tags</FormLabel>
                      <FormControl>
                        <Input placeholder="Biceps" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add any relevant tags, like &quot;arms&quot; or
                        &quot;calves,&quot; separated by a comma.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" className="bg-secondary">
                      Add workout
                      <i
                        className="fa-solid"
                        style={{ color: "hsl(var(--primary))" }}
                      />
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-3 gap-4 px-20">
        {cardData.map((card: any, index: any) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{card.title}</CardTitle>
                <div className="flex gap-2">
                  <Button className="bg-accent" size="icon">
                    <i
                      className="fa-solid fa-pen-to-square"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                  </Button>
                  <Button className="bg-accent" size="icon">
                    <i
                      className="fa-solid fa-trash"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                  </Button>
                </div>
              </div>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-lg font-medium leading-none">Exercises</p>
                  {card.exercises.map((exercise: any, exerciseIndex: any) => (
                    <div key={exerciseIndex} className="flex gap-3">
                      <p>
                        {exerciseIndex + 1}. {exercise.name}
                      </p>
                      <p>{exercise.sets}</p>
                      <p>{exercise.rest} rest</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between">
                <p className="text-sm font-medium leading-none">{card.time}</p>
                <p className="text-sm font-medium leading-none"></p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
