import connectDB from "@/database/db";
import { NextResponse, NextRequest } from "next/server";

// Search all exercises
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
    if (muscle_groups) {
      query = query.contains("muscle_groups", [muscle_groups]);
    }
    if (equipment) {
      query = query.contains("equipment", [equipment]);
    }

    ({ data, error } = await query);

    if (error) {
      throw error;
    }

    if (data && data.length === 0) {
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

    const { w_id, exercise_id, reps, sets } = await req.json();

    if (!w_id || !exercise_id || reps === undefined || sets === undefined) {
      throw new Error("Missing required inputs");
    }

    const { data: exercise_info, error: exercise_error } = await db
      .from("exercises")
      .select("*")
      .match({ ex_id: exercise_id });

    if (exercise_error) {
      throw exercise_error;
    }

    const { data: workout_info, error: workout_error } = await db
      .from("workouts")
      .insert([{ exercise_id, w_id, reps, sets }] as any);

    if (workout_error) {
      throw workout_error;
    }

    return NextResponse.json({
      message: "Exercise added",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to add exercise.`,
      status: 500,
    });
  }
}

// Delete Exercise from Workout
export async function DELETE(req: Request) {
  try {
    const db = connectDB();
    const url = new URL(req.url ? req.url : "invalid");
    const exercise_id = url.searchParams.get("exercise_id");
    const w_id = url.searchParams.get("w_id");

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    if (!exercise_id || !w_id) {
      throw new Error("exercise_id or w_id is missing in the request");
    }

    const { data: existingExercise, error: exercise_error } = await db
      .from("workouts")
      .select("*")
      .eq("exercise_id", exercise_id)
      .eq("w_id", w_id);

    if (!existingExercise || existingExercise.length === 0) {
      throw new Error(
        `Exercise with ID ${exercise_id} does not exist in workout ${w_id}`,
      );
    }

    const { error } = await db
      .from("workouts")
      .delete()
      .match({ exercise_id: exercise_id, w_id: w_id });

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
      message: `Failed to delete exercise from workout. ${error}`,
      status: 500,
    });
  }
}

// Edit reps and sets for exercise
export async function PUT(req: NextRequest) {
  try {
    const db = connectDB();

    const { exercise_id, w_id, reps, sets } = await req.json();

    const { error } = await db
      .from("workouts")
      .update({ exercise_id, w_id, reps, sets })
      .match({ exercise_id, w_id });

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
