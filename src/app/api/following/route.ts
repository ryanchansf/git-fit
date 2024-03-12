import connectDB from "@/database/db";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url ? req.url : "invalid");
  const username = url.searchParams.get("username");
  try {
    const db = connectDB();
    // const url = new URL(req.url ? req.url : "invalid");
    // const username = url.searchParams.get("username");

    let data, error;
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    // If a username is provided, get that specific user
    if (username) {
      ({ data, error } = await db
        .from("following")
        .select("following")
        .eq("follower", username));
      //pretty sure I don't need this..
      //   // If no user was found, throw an error
      //   if (data && data.length === 0) {
      //     throw new Error(`User with username ${username} not found`);
      //   }
    } else {
      // If no username is provided, get all users
      ({ data, error } = await db.from("following").select("*"));
    }

    if (error) {
      throw error;
    }
    // Return the following in the response
    return NextResponse.json({
      message: "Following displayed",
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
export async function POST(req: NextRequest) {
  const url = new URL(req.url ? req.url : "invalid");
  const follower = url.searchParams.get("username");
  try {
    const db = connectDB();
    // console.log("backend post:", follower);

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { following } = await req.json();
    // console.log("follower: ", follower);
    // console.log("following: ", following);
    // make sure FOLLOWER exist
    const { data: check_follower, error: follower_exists_error } = await db
      .from("users")
      .select("*")
      .match({ username: follower });
    // console.log("check follower: ", check_follower);

    if (!check_follower || check_follower.length === 0) {
      throw new Error("follower input invalid: user not found");
    }
    if (follower_exists_error) {
      throw follower_exists_error;
    }
    //make sure FOLLOWING exists
    const { data: check_following, error: following_exists_error } = await db
      .from("users")
      .select("*")
      .match({ username: following });
    // console.log("check_following", check_following);

    if (!check_following || check_following.length === 0) {
      throw new Error("data input invalid: user not found");
    }
    if (following_exists_error) {
      throw following_exists_error;
    }

    // make sure relationship isn't already in the database (can't follow more than once)
    const { data: check_rel, error: rel_exists_error } = await db
      .from("following")
      .select("*")
      .match({ follower: follower, following: following });
    // console.log("check_relationship", check_rel);

    if (!check_rel || check_rel.length > 0) {
      throw new Error("relationship already exists");
    }
    if (rel_exists_error) {
      throw rel_exists_error;
    }
    //no issues, insert the friendship
    const { data: following_info, error } = await db
      .from("following")
      .insert([{ follower, following }] as any);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Success",
      status: 201,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `No friend for you`,
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url ? req.url : "invalid");
  const follower = url.searchParams.get("username");
  try {
    const db = connectDB();
    // console.log("backend post:", follower);

    if (!db) {
      throw new Error("Failed to connect to the database");
    }

    const { following } = await req.json();
    // console.log("follower: ", follower);
    // console.log("following: ", following);
    // make sure FOLLOWER exist
    const { data: check_follower, error: follower_exists_error } = await db
      .from("users")
      .select("*")
      .match({ username: follower });
    // console.log("check follower: ", check_follower);

    if (!check_follower || check_follower.length === 0) {
      throw new Error("follower input invalid: user not found");
    }
    if (follower_exists_error) {
      throw follower_exists_error;
    }
    //make sure FOLLOWING exists
    const { data: check_following, error: following_exists_error } = await db
      .from("users")
      .select("*")
      .match({ username: following });
    // console.log("check_following", check_following);

    if (!check_following || check_following.length === 0) {
      throw new Error("data input invalid: user not found");
    }
    if (following_exists_error) {
      throw following_exists_error;
    }
    // delete relationship from the database
    const { data: del_rel, error: delete_error } = await db
      .from("following")
      .delete()
      .match({ follower: follower, following: following });
    if (delete_error) {
      throw delete_error;
    }
    return NextResponse.json({
      message: `${follower} no longer follows ${following}`,
      status: 200,
    });
  } catch (error) {
    console.error(error); // Log the error to the console
    return NextResponse.json({
      message: `Failed to delete remove following`,
      status: 500,
    });
  }
}
