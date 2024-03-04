import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = connectDB();
    const url = new URL(req.url ? req.url : "invalid");
    const exercise_name = url.searchParams.get("exercise_name");
    const muscle_groups = url.searchParams.get("muscle_groups");
    const equipment = url.searchParams.get("equipment");

    let data, error;
    let query = supabase.from("exercises").select("*");

    if (exercise_name) {
      query = query.ilike("exercise_name", exercise_name);
    }
    // modify search for muscle_groups and equpiments since they are arrays
    if (muscle_groups) {
      query = query.eq("muscle_groups", muscle_groups);
    }
    if (equipment) {
      query = query.eq("equipment", equipment);
    }

    ({ data, error } = await query);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return NextResponse.json({
        message: "No exercises found matching the criteria",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Exercises retrieved",
      status: 200,
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to retrieve exercises: ${error}`,
      status: 500,
    });
  }
}

// Add an exercise to a workout
export async function POST(req: Request) {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { w_id, exercise_id, reps } = await req.json();

    if (!w_id || !exercise_id || reps === undefined) {
      throw new Error("Missing required inputs");
    }

    const { data: exercise_info, error: exercise_error } = await db
      .from("exercises")
      .select("*")
      .match({ ex_id: exercise_id });

    if (exercise_error) {
      throw exercise_error;
    }

    if (exercise_info.length > 0) {
      throw new Error("The exercise is already in the workout");
    }

    const { data: workout_info, error: workout_error } = await db
      .from("workouts")
      .insert([{ exercise_id, w_id, reps }] as any);

    if (workout_error) {
      // console.log(workout_error)
      throw workout_error;
    }

    return NextResponse.json({
      message: "Exercise added",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to add exercise. Please try again later`,
      status: 500,
    });
  }
}

// Delete Exercise from Workout
export async function DELETE(req: Request) {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { exercise_id, w_id } = await req.json();

    const { data, error } = await db
      .from("workouts")
      .delete()
      .match({ exercise_id: exercise_id });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Exercise deleted from workout",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to delete exercise from workout: ${error}`,
      status: 500,
    });
  }
}
