import connectDB from "@database/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { data: workouts, error } = await db.from("workout_info").select("*");

    if (error) {
      throw error;
    }
    // Return the workouts in the response
    return NextResponse.json({
      message: "Workouts retrieved",
      status: 200,
      workouts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `${error}`,
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

    const { username, duration, difficulty, tags, w_name } = await req.json();
    console.log(username, duration, difficulty, tags, w_name);

    // Insert the new workout into the Supabase database
    const { data: workout_info, error } = await db
      .from("workout_info")
      .insert([{ username, duration, difficulty, tags, w_name }] as any);

    if (error) {
      throw error;
    }

    // Return the workout_id in the response
    return NextResponse.json({
      message: "Workout Created",
      status: 201,
      workout_info,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `Failed to create workout: ${error}`,
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

    const { w_id } = await req.json();

    // Delete workout in Supabase database
    const { data, error } = await db
      .from("workout_info")
      .delete()
      .match({ w_id: w_id });

    if (error) {
      throw error;
    }

    // Return success message in response
    return NextResponse.json({
      message: "Workout deleted",
      status: 200,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `Failed to delete workout. Please try again later`,
      status: 500,
    });
  }
}
