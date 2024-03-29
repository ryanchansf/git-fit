import connectDB from "@/database/db";
import { NextResponse, NextRequest } from "next/server";

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
    const w_id = url.searchParams.get("w_id");

    let data, error;
    let query = db.from("workout_info").select("*");

    if (w_id) {
      query = db
        .from("workouts")
        .select(`exercises ( exercise_name ), sets, reps`)
        .eq("w_id", w_id);
    }
    if (username) {
      query = query.ilike("username", username);
    }
    if (!isNaN(duration)) {
      query = query.eq("duration", duration);
    }
    if (difficulty) {
      query = query.ilike("difficulty", difficulty);
    }
    if (tags) {
      query = query.contains("tags", [tags]);
    }
    if (w_name) {
      query = query.ilike("w_name", w_name);
    }

    ({ data, error } = await query);

    if (error) {
      throw error;
    }

    if (data && data.length === 0) {
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

export async function POST(req: Request) {
  try {
    const db = connectDB();

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { username, duration, difficulty, tags, w_name, w_id } =
      await req.json();

    if (!username || !duration || !difficulty || !tags || !w_name) {
      throw new Error("Missing required parameters");
    }

    console.log(username, duration, difficulty, tags, w_name);

    let workout_info, error;
    if (w_id) {
      ({ data: workout_info, error } = await db
        .from("workout_info")
        .insert([
          { w_id, username, duration, difficulty, tags, w_name },
        ] as any));
    } else {
      ({ data: workout_info, error } = await db
        .from("workout_info")
        .insert([{ username, duration, difficulty, tags, w_name }] as any));
    }

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
    const url = new URL(req.url ? req.url : "invalid");
    const w_id = url.searchParams.get("w_id");
    const username = url.searchParams.get("username");

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    if (!w_id) {
      throw new Error("w_id is missing in the request");
    }

    if (!username) {
      throw new Error("username is missing in the request");
    }

    const { data: existingWorkouts, error: workout_error } = await db
      .from("workout_info")
      .select("*")
      .eq("w_id", w_id)
      .eq("username", username);

    if (existingWorkouts && existingWorkouts.length == 0) {
      throw new Error(
        `Workout with ID ${w_id} does not exist for user ${username}`,
      );
    }

    const { error: deleteError } = await db
      .from("workout_info")
      .delete()
      .match({ w_id, username });

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      message: "Workout deleted",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to delete workout. ${error}`,
      status: 500,
    });
  }
}

// Update Workout
export async function PUT(req: NextRequest) {
  try {
    const db = connectDB();

    const { w_id, username, duration, difficulty, tags, w_name } =
      await req.json();

    const { error } = await db
      .from("workout_info")
      .update({ username, duration, difficulty, tags, w_name })
      .match({ w_id, username });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Workout updated",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to update workout. ${error}`,
      status: 500,
    });
  }
}
