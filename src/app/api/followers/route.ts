import connectDB from "@/database/db";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { NextRequest, NextResponse } from "next/server";

// make is so get request takes in username and only returns followers where the data matches req
export async function GET(req: NextRequest) {
  try {
    const db = connectDB();
    const url = new URL(req.url ? req.url : "invalid");
    const username = url.searchParams.get("username");
    console.log("backend:", username);

    let data, error;
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    // If a username is provided, get that specific user
    if (username) {
      ({ data, error } = await db
        .from("following")
        .select("follower")
        .eq("following", username));

      // If no user was found, throw an error
      if (data && data.length === 0) {
        throw new Error(`User with username ${username} not found`);
      }
    } else {
      // If no username is provided, get all users
      ({ data, error } = await db.from("following").select("*"));
    }

    if (error) {
      throw error;
    }
    console.log("backend.data: ", data);
    // Return the workouts in the response
    return NextResponse.json({
      message: "Followers displayed",
      status: 200,
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `They don't like anyone: ${error}`,
      status: 500,
    });
  }
}
