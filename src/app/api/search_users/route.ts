import connectDB from "@/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url ? req.url : "invalid");
  const username = url.searchParams.get("username");

  try {
    const supabase = connectDB();
    let data, error;

    // If a username is provided, get that specific user
    if (username) {
      ({ data, error } = await supabase
        .from("users")
        .select("username")
        .ilike("username", `%${username}%`));
    } else {
      // If no username is provided, get all users
      ({ data, error } = await supabase.from("users").select("*"));
    }

    if (error) {
      throw error;
    }
    // Return the users in the response
    return NextResponse.json({
      message: "Users retrieved",
      status: 200,
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to retrieve users: ${error}`,
      status: 500,
    });
  }
}
