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

export async function GET() {
  try {
    const supabase = connectDB();

    // Get all users from the database
    const { data, error } = await supabase.from("users").select("*");

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

export async function PUT(req: Request) {
  try {
    const supabase = connectDB();

    const { username, phoneNumber, email } = await req.json();

    // Update the user in the database
    const { error } = await supabase
      .from("users")
      .update({ username, phoneNumber, email })
      .match({ username });

    if (error) {
      throw error;
    }

    // Return the user_id in the response
    return NextResponse.json({
      message: "User updated",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: `Failed to update user: ${error}`,
      status: 500,
    });
  }
}
