import connectDB from "@/database/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { data: exercises, error } = await db.from("exercises").select("*");

    if (error) {
      throw error;
    }
    // Return the workouts in the response
    return NextResponse.json({
      message: "Exercises displayed",
      status: 200,
      exercises,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to display exercises: ${error}`,
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { exercise_name } = await req.json();

    // Select exercise based on exercise_id in Supabase database
    const { data: exercise_info, error: exercise_error } = await db
      .from("exercises")
      .select("*")
      .ilike("exercise_name", `%${exercise_name}%`);

    if (exercise_error) {
      throw exercise_error;
    }

    const { ex_id, muscle_groups, equpiment } = exercise_info[0]; // Extract ex_id from the first result

    return NextResponse.json({
      message: "Exercise found",
      status: 200,
      exercise_name,
      ex_id,
      muscle_groups,
      equpiment,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `Failed to find exercise. Please try again later`,
      status: 500,
    });
  }
}
