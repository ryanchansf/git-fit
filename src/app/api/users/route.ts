import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  try {
    const supabase = connectDB();
    const url = new URL(req.url ? req.url : "invalid");
    const username = url.searchParams.get("username");

    let data, error;

    // If a username is provided, get that specific user
    if (username) {
      ({ data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username));

      // If no user was found, throw an error
      if (data.length === 0) {
        throw new Error(`User with username ${username} not found`);
      }
    } else {
      // If no username is provided, get all users
      ({ data, error } = await supabase.from("users").select("*"));
    }

    if (error) {
      throw error;
    }
    console.log("returning data: ", data);
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
