import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import WelcomeHeader from "@/components/welcomeHeader";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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

export default async function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between px-100">
        <WelcomeHeader />
        <Button className="bg-secondary" size="lg">
          <i
            className="fa-solid fa-plus"
            style={{ color: "hsl(var(--primary))" }}
          />
        </Button>
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
