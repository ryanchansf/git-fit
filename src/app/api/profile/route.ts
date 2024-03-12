import connectDB from "@/database/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url ? req.url : "invalid");
  const username = url.searchParams.get("username");
  try {
    const db = connectDB();

    if (!username) {
      return NextResponse.json({
        message: "No username provided",
        status: 400,
      });
    }

    const workoutsCountResponse = await db
      .from("workout_info")
      .select("w_id")
      .eq("username", username);

    // Count following for the user
    const followingCount = await db
      .from("following")
      .select("follower")
      .eq("follower", username);

    // Count followers for the user
    const followersCount = await db
      .from("following")
      .select("following")
      .eq("following", username);

    const profileData = {
      workouts: workoutsCountResponse.data?.length || 0,
      followers: followersCount.data?.length || 0,
      following: followingCount.data?.length || 0,
    };

    return NextResponse.json({ data: profileData, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to retrieve users: ${error}`,
      status: 500,
    });
  }
}
