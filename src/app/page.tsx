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

//TODO: import card data from database
function getWorkouts() {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const workouts = db.from("workout_info").select("*");
    //.match({ ex_id: exercise_id });

    // Return the workouts in the response
    // return NextResponse.json({
    //   message: "Exercises displayed",
    //   status: 200,
    //   workouts,
    // });
    return workouts;
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to display workouts: ${error}`,
      status: 500,
    });
  }
}

// const cardData1 = [
//   {

//   }
// ]

const cardData = [
  {
    title: "Push 1",
    description: "Created by John Doe on 1/17/2024",
    time: "Total Time: 1h 30m",
    exercises: [
      { name: "Bench Press", sets: "4x8", rest: "2 min" },
      { name: "Overhead Press", sets: "4x8", rest: "2 min" },
      { name: "Tricep Extension", sets: "4x8", rest: "2 min" },
      { name: "Tricep Dips", sets: "4x8", rest: "2 min" },
      { name: "Lateral Raises", sets: "4x8", rest: "2 min" },
    ],
  },
  {
    title: "Push 1",
    description: "Created by John Doe on 1/17/2024",
    time: "Total Time: 1h 30m",
    exercises: [
      { name: "Bench Press", sets: "4x8", rest: "2 min" },
      { name: "Overhead Press", sets: "4x8", rest: "2 min" },
      { name: "Tricep Extension", sets: "4x8", rest: "2 min" },
      { name: "Tricep Dips", sets: "4x8", rest: "2 min" },
      { name: "Lateral Raises", sets: "4x8", rest: "2 min" },
    ],
  },
  {
    title: "Push 1",
    description: "Created by John Doe on 1/17/2024",
    time: "Total Time: 1h 30m",
    exercises: [
      { name: "Bench Press", sets: "4x8", rest: "2 min" },
      { name: "Overhead Press", sets: "4x8", rest: "2 min" },
      { name: "Tricep Extension", sets: "4x8", rest: "2 min" },
      { name: "Tricep Dips", sets: "4x8", rest: "2 min" },
      { name: "Lateral Raises", sets: "4x8", rest: "2 min" },
    ],
  },
  {
    title: "Push 1",
    description: "Created by John Doe on 1/17/2024",
    time: "Total Time: 1h 30m",
    exercises: [
      { name: "Bench Press", sets: "4x8", rest: "2 min" },
      { name: "Overhead Press", sets: "4x8", rest: "2 min" },
      { name: "Tricep Extension", sets: "4x8", rest: "2 min" },
      { name: "Tricep Dips", sets: "4x8", rest: "2 min" },
      { name: "Lateral Raises", sets: "4x8", rest: "2 min" },
    ],
  },
];

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
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficulty: "Medium",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(getWorkouts());
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between px-100">
        <h1 className="text-4xl font-bold">Welcome back, username</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-secondary" size="lg">
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
        {cardData.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle> &lt; {card.title} /&gt;</CardTitle>
                <div className="flex gap-2">
                  <Button className="bg-secondary" size="icon">
                    <i
                      className="fa-solid fa-pen-to-square"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                  </Button>
                  <Button className="bg-secondary" size="icon">
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
                  {card.exercises.map((exercise, exerciseIndex) => (
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
