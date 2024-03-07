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
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import WelcomeHeader from "@/components/welcomeHeader";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// TODO:
//   - Link exercises to cards (talk to ananya)
//   - Make edit button work
//   - Disable "Add workout" button until form errors are corrected
//   - Clear form fields after submitting form
//   - Finish onSubmitEditWorkout function

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
      name: "",
      duration: "",
      difficulty: "Medium",
      tags: "",
    },
    // Show errors immediately
    mode: "onChange",
  });

  //const { formState: 2{ errors, isDirty, isValid } } = useForm();

  async function onSubmitAddWorkout(values: z.infer<typeof formSchema>) {
    const message = {
      username: username,
      duration: values.duration,
      difficulty: values.difficulty,
      // Extract individual tags by removing spaces and splitting along commas
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
    // Trigger card reload
    setCardChange(cardChange + 1);
    return promise;
  }

  async function onSubmitEditWorkout(values: z.infer<typeof formSchema>) {
    const message = {
      //w_id: ,
      username: username,
      duration: values.duration,
      difficulty: values.difficulty,
      // Extract individual tags by removing spaces and splitting along commas
      tags: values.tags.replaceAll(" ", "").split(","),
      w_name: values.name,
    };
    const promise = await fetch("/api/workouts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    // Trigger card reload
    setCardChange(cardChange + 1);
    return promise;
  }

  async function handleDeleteClick(cardTitle: any) {
    // Extract workout id from card title
    const w_id = cardTitle.split(":")[0].substring(1);
    const promise = await fetch(`/api/workouts?w_id=${w_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Trigger card reload
    setCardChange(cardChange + 1);
    return promise;
  }

  const [cardData, setCardData] = useState<any>([]);
  const [cardChange, setCardChange] = useState(0);

  // Reload cards if deletions, edits, additions are made
  useEffect(() => {
    async function getCardData() {
      const cardData: Object[] = [];
      await fetch(`/api/workouts?username=${session?.user?.name}`)
        .then((response) => response.json())
        .then((message) => {
          // Order by workout ID, newest first
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
        });
      setCardData(cardData);
    }
    if (session?.user?.name) {
      getCardData();
    }
  }, [cardChange, session?.user?.name]);

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
                you&apos;re done, or X to cancel.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitAddWorkout)}
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-accent" size="icon">
                        <i
                          className="fa-solid fa-pen-to-square"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit workout</DialogTitle>
                        <DialogDescription>
                          Make changes to your workout here. Click &quot;submit
                          changes&quot; when you&apos;re done, or X to cancel.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form
                          // cardTitle.split(':')[0].substring(1)
                          onSubmit={form.handleSubmit(onSubmitEditWorkout)}
                          className="space-y-8"
                        >
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Workout name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={card.title.split(": ")[1]}
                                    {...field}
                                  />
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
                                  <Input
                                    placeholder={card.duration}
                                    {...field}
                                  />
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
                                    <SelectItem value="Medium">
                                      Medium
                                    </SelectItem>
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
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                  <Input placeholder={card.tags} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="submit" className="bg-secondary">
                                Submit changes
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-accent" size="icon">
                        <i
                          className="fa-solid fa-trash"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Delete workout</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this workout? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="submit"
                            className="bg-destructive"
                            onClick={() => handleDeleteClick(card.title)}
                          >
                            Delete workout
                            <i
                              className="fa-solid"
                              style={{ color: "hsl(var(--primary))" }}
                            />
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
