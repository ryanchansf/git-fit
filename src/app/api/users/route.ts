import { NextResponse } from "next/server";
import connectDB from "@/database/db";

export async function POST(req: Request) {
  try {
    const supabase = connectDB();

    const { username, phoneNumber, email } = await req.json();
    console.log(username, phoneNumber, email);

    // Insert the new user into the Supabase database
    const { error } = await supabase
      .from("users")
      .insert([{ username, phoneNumber, email }]);

    if (error) {
      throw error;
    }

    // Return the user_id in the response
    return NextResponse.json({
      message: "User registered",
      status: 201,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `Failed to create user: ${error}`,
      status: 500,
    });
  }
}
