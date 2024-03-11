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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

// TODO:
//   - Link exercises to cards
//   - Make edit button work
//       - Import existing settings as default values
//   - Attach workout_id to edit workout and add exercise forms

const addWorkoutFormSchema = z.object({
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

const editWorkoutFormSchema = z.object({
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

const addExerciseFormSchema = z.object({
  exercise: z.number(),
  sets: z
    .string()
    .min(1, { message: "Sets must be an integer greater than 0" })
    .max(3, { message: "Sets must be an integer less than 1000" })
    // Regex to detect if the input is an integer
    .refine((str) => /^\d+$/.test(str), {
      message: "Sets must be an integer",
    }),
  reps: z
    .string()
    .min(1, { message: "Reps must be an integer greater than 0" })
    .max(3, { message: "Reps must be an integer less than 1000" })
    // Regex to detect if the input is an integer
    .refine((str) => /^\d+$/.test(str), {
      message: "Reps must be an integer",
    }),
});

export default function Home() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // These specify default values that appear in the forms
  const addWorkoutForm = useForm<z.infer<typeof addWorkoutFormSchema>>({
    resolver: zodResolver(addWorkoutFormSchema),
    defaultValues: {
      name: "",
      duration: "",
      difficulty: "Medium",
      tags: "",
    },
    // Show errors immediately
    mode: "onChange",
  });

  const editWorkoutForm = useForm<z.infer<typeof editWorkoutFormSchema>>({
    resolver: zodResolver(editWorkoutFormSchema),
    defaultValues: {
      name: "",
      duration: "",
      difficulty: "Medium",
      tags: "",
    },
    // Show errors immediately
    mode: "onChange",
  });

  const addExerciseForm = useForm<z.infer<typeof addExerciseFormSchema>>({
    resolver: zodResolver(addExerciseFormSchema),
    defaultValues: {
      sets: "",
      reps: "",
    },
    // Show errors immediately
    mode: "onChange",
  });

  // Allow the submit buttons to be disabled when the form contains errors
  const {
    formState: { isValid: addIsValid },
  } = addWorkoutForm;
  const {
    formState: { isValid: editIsValid },
  } = editWorkoutForm;
  const {
    formState: { isValid: exerciseIsValid },
  } = addExerciseForm;

  // Handlers for when buttons are clicked
  async function onSubmitAddWorkout(
    values: z.infer<typeof addWorkoutFormSchema>,
  ) {
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

  async function onSubmitEditWorkout(
    values: z.infer<typeof editWorkoutFormSchema>,
    w_id: any,
  ) {
    const message = {
      w_id: w_id,
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

  async function onSubmitAddExercise(
    values: z.infer<typeof addExerciseFormSchema>,
    w_id: any,
  ) {
    const message = {
      w_id: w_id,
      username: username,
      exercise_id: values.exercise,
      sets: values.sets,
      reps: values.reps,
    };
    const promise = await fetch("/api/exercises", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
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

  // Control which parts of the page get reloaded, and when
  const [cardData, setCardData] = useState<any>([]);
  const [cardChange, setCardChange] = useState(0);
  const [exercises, setExercises] = useState<any>([]);

  // Reload cards if deletions, edits, additions are made
  // Also clears the add/edit forms
  useEffect(() => {
    async function getCardData() {
      const cardData: Object[] = [];
      await fetch(`/api/workouts?username=${session?.user?.name}`)
        .then((response) => response.json())
        .then((message) => {
          // Necessary so empty message data doesn't throw an error
          if (message.status !== 404) {
            // Order by workout ID, newest first
            for (const obj of message.data.sort(
              (a: any, b: any) => b.w_id - a.w_id,
            )) {
              cardData.push({
                title: `#${obj.w_id}: ${obj.w_name}`,
                description: `Difficulty: ${obj.difficulty}`,
                time: `Total time: ${obj.duration} min`,
                exercises: [],
              });
            }
          }
        });
      setCardData(cardData);
    }
    if (session?.user?.name) {
      getCardData();
    }
    // Clear form data
    addWorkoutForm.reset();
    editWorkoutForm.reset();
    addExerciseForm.reset();
  }, [cardChange, session?.user?.name]);

  // Fetch exercises from backend
  useEffect(() => {
    async function getExercises() {
      const exercises: Object[] = [];
      await fetch("api/exercises")
        .then((response) => response.json())
        .then((message) => {
          for (const obj of message.data) {
            exercises.push({
              value: obj.ex_id,
              label: obj.exercise_name,
            });
          }
        });
      setExercises(exercises);
    }
    getExercises();
    // This boolean stops an infinite refresh loop. I don't know why
  }, [false]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between px-100">
        <WelcomeHeader />
        {/* Add workout dialogue */}
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
            <Form {...addWorkoutForm}>
              <form
                onSubmit={addWorkoutForm.handleSubmit(onSubmitAddWorkout)}
                className="space-y-8"
              >
                <FormField
                  control={addWorkoutForm.control}
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
                  control={addWorkoutForm.control}
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
                  control={addWorkoutForm.control}
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
                  control={addWorkoutForm.control}
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
                    {/* Uses a ternary operator to render 1 of 2 buttons depending on whether isValid is true or not. 
                      If isValid is false, disable the button. 
                      If it's true, enable the button */}
                    {!addIsValid ? (
                      <Button disabled type="submit" className="bg-secondary">
                        Add workout
                        <i
                          className="fa-solid"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-secondary">
                        Add workout
                        <i
                          className="fa-solid"
                          style={{ color: "hsl(var(--primary))" }}
                        />
                      </Button>
                    )}
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Start of workout cards grid */}
      <div className="grid grid-cols-3 gap-4 px-20">
        {cardData.map((card: any, index: any) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{card.title}</CardTitle>
                <div className="flex gap-2">
                  {/* Edit workout dialogue */}
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
                      <Form {...editWorkoutForm}>
                        <form
                          onSubmit={editWorkoutForm.handleSubmit((formData) =>
                            onSubmitEditWorkout(
                              formData,
                              card.title.split(":")[0].substring(1),
                            ),
                          )}
                          className="space-y-8"
                        >
                          <FormField
                            control={editWorkoutForm.control}
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
                            control={editWorkoutForm.control}
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
                            control={editWorkoutForm.control}
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
                            control={editWorkoutForm.control}
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
                              {/* Uses a ternary operator to render 1 of 2 buttons depending on whether isValid is true or not. 
                                If isValid is false, disable the button. 
                                If it's true, enable the button */}
                              {!editIsValid ? (
                                <Button
                                  disabled
                                  type="submit"
                                  className="bg-secondary"
                                >
                                  Submit changes
                                  <i
                                    className="fa-solid"
                                    style={{ color: "hsl(var(--primary))" }}
                                  />
                                </Button>
                              ) : (
                                <Button type="submit" className="bg-secondary">
                                  Submit changes
                                  <i
                                    className="fa-solid"
                                    style={{ color: "hsl(var(--primary))" }}
                                  />
                                </Button>
                              )}
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  {/* Delete workout dialogue */}
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
              {/* Template for each individual card */}
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
                  {/* Add exercise dialogue */}
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
                        <DialogTitle>Add exercise to workout</DialogTitle>
                        <DialogDescription>
                          Add an exercise to your workout here. Click &quot;add
                          exercise&quot; when you&apos;re done, or X to cancel.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...addExerciseForm}>
                        <form
                          onSubmit={addExerciseForm.handleSubmit((formData) =>
                            onSubmitAddExercise(
                              formData,
                              card.title.split(":")[0].substring(1),
                            ),
                          )}
                          className="space-y-8"
                        >
                          <FormField
                            control={addExerciseForm.control}
                            name="exercise"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Exercise</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-[375px] justify-between",
                                          !field.value &&
                                            "text-muted-foreground",
                                        )}
                                      >
                                        {field.value
                                          ? exercises.find(
                                              (exercise: any) =>
                                                exercise.value === field.value,
                                            )?.label
                                          : "Select exercise"}
                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-[375px] p-0">
                                    <Command>
                                      <CommandInput
                                        placeholder="Search exercises..."
                                        className="h-9"
                                      />
                                      <ScrollArea className="h-48 overflow-auto">
                                        <CommandEmpty>
                                          No exercise found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {exercises.map((exercise: any) => (
                                            <CommandItem
                                              value={exercise.label}
                                              key={exercise.value}
                                              onSelect={() => {
                                                addExerciseForm.setValue(
                                                  "exercise",
                                                  exercise.value,
                                                );
                                              }}
                                            >
                                              {exercise.label}
                                              <CheckIcon
                                                className={cn(
                                                  "ml-auto h-4 w-4",
                                                  exercise.value === field.value
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </ScrollArea>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addExerciseForm.control}
                            name="sets"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sets</FormLabel>
                                <FormControl>
                                  <Input placeholder="5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addExerciseForm.control}
                            name="reps"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reps</FormLabel>
                                <FormControl>
                                  <Input placeholder="10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              {/* Uses a ternary operator to render 1 of 2 buttons depending on whether isValid is true or not. 
                                If isValid is false, disable the button. 
                                If it's true, enable the button */}
                              {!exerciseIsValid ? (
                                <Button
                                  disabled
                                  type="submit"
                                  className="bg-secondary"
                                >
                                  Add exercise
                                  <i
                                    className="fa-solid"
                                    style={{ color: "hsl(var(--primary))" }}
                                  />
                                </Button>
                              ) : (
                                <Button type="submit" className="bg-secondary">
                                  Add exercise
                                  <i
                                    className="fa-solid"
                                    style={{ color: "hsl(var(--primary))" }}
                                  />
                                </Button>
                              )}
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
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
