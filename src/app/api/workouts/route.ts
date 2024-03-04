import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

//Search all Workouts
export async function GET(req: NextRequest) {
  try {
    const db = connectDB();
    const url = new URL(req.url ? req.url : "invalid");
    const username = url.searchParams.get("username");
    const duration = parseInt(url.searchParams.get("duration") || "");
    const difficulty = url.searchParams.get("difficulty");
    const tags = url.searchParams.get("tags");
    const w_name = url.searchParams.get("w_name");

    let data, error;

    let query = db.from("workout_info").select("*");

    if (username) {
      query = query.ilike("username", username);
    }
    if (!isNaN(duration)) {
      query = query.eq("duration", duration);
    }
    if (difficulty) {
      query = query.ilike("difficulty", difficulty);
    }
    //confusion on how to search tags bc it's an array
    if (tags) {
      query = query.eq("tags", tags);
    }
    if (w_name) {
      query = query.ilike("w_name", w_name);
    }

    ({ data, error } = await query);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return NextResponse.json({
        message: "No workouts found matching the criteria",
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Workouts retrieved",
      status: 200,
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to retrieve workouts. ${error}`,
      status: 500,
    });
  }
}

//Add workout to user profile
//Do i need to check which user profile I am in and if so, how?

export async function POST(req: Request) {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { username, duration, difficulty, tags, w_name } = await req.json();

    // Check if any of the required parameters are missing
    if (!username || !duration || !difficulty || !tags || !w_name) {
      throw new Error("Missing required parameters");
    }

    console.log(username, duration, difficulty, tags, w_name);

    const { data: workout_info, error } = await db
      .from("workout_info")
      .insert([{ username, duration, difficulty, tags, w_name }] as any);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Workout Created",
      status: 201,
      workout_info,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to create workout. ${error}`,
      status: 500,
    });
  }
}

//Delete Workout
export async function DELETE(req: Request) {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { username, w_name } = await req.json();

    //need to check if workout exists before deleting first, missing this rn
    //confused on how to check which user profile im in to see their specific workouts and what to delete

    const { data, error } = await db
      .from("workout_info")
      .delete()
      .match({ username: username, w_name: w_name });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Workout deleted",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to delete workout. Please try again later`,
      status: 500,
    });
  }
}
