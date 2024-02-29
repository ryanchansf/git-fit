import connectDB from "@database/db";
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

    const { w_id, exercise_id, reps } = await req.json();

    // Check if all required fields are present
    if (!w_id || !exercise_id || reps === undefined) {
      throw new Error("Missing required fields in the request body");
    }

    // Select exercise based on exercise_id in Supabase database
    const { data: exercise_info, error: exercise_error } = await db
      .from("exercises")
      .select("*")
      .match({ ex_id: exercise_id });

    if (exercise_error) {
      throw exercise_error;
    }

    // Add exercise to workout based on workout_id
    const { data: workout_info, error: workout_error } = await db
      .from("workouts")
      .insert([{ exercise_id, w_id, reps }] as any);

    if (workout_error) {
      throw workout_error;
    }

    // Return success message in response
    return NextResponse.json({
      message: "Exercise added",
      status: 200,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `Failed to add exercise. Please try again later`,
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { exercise_id, w_id } = await req.json();

    // Delete workout in Supabase database
    const { data, error } = await db
      .from("workouts")
      .delete()
      .match({ exercise_id: exercise_id });

    if (error) {
      throw error;
    }

    // Return success message in response
    return NextResponse.json({
      message: "Exercise deleted from workout",
      status: 200,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `Failed to delete exercise from workout: ${error}`,
      status: 500,
    });
  }
}
