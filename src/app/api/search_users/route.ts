import connectDB from "@/database/db";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { username } = await req.json();
  try {
    console.log("here bruh");
    const db = connectDB();
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    console.log("fed up");
    console.log(username);
    console.log("overthissss");

    if (!username) {
      throw new Error("Missing username");
    }
    const { data: results, error } = await db
      .from("users")
      .select("*")
      .match({ username: username });

    if (error) {
      throw error;
    }
    return NextResponse.json({
      message: "User displayed",
      status: 200,
      results,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to find user: ${error}`,
      status: 500,
    });
  }
}
