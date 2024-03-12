import connectDB from "@/database/db";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { username } = await req.json();
  try {
    console.log("hereeeee");
    const db = connectDB();
    // const url = new URL(req.url ? req.url : "invalid");
    // const username = url.searchParams.get("username");
    if (!db) {
      throw new Error("Failed to connect to the database");
    }
    console.log(username);
    // If a username is provided, get that specific user
    if (!username) {
      throw new Error("Missing username");
    }

    const { data: results, error } = await db
      .from("users")
      .select("username")
      .ilike("username", `%${username}%`);

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

// export async function GET(req: NextRequest) {
//   try {
//     console.log("hereeeee");
//     const supabase = connectDB();
//     const url = new URL(req.url ? req.url : "invalid");
//     const username = url.searchParams.get("username");

//     let data, error;

//     // If a username is provided, get that specific user
//     if (username) {
//       ({ data, error } = await supabase
//         .from("users")
//         .select("username")
//         .ilike("username", `%${username}%`));
//     } else {
//       // If no username is provided, get all users
//       ({ data, error } = await supabase.from("users").select("*"));
//     }

//     if (error) {
//       throw error;
//     }
//     console.log("returning data: ", data);
//     // Return the users in the response
//     return NextResponse.json({
//       message: "Users retrieved",
//       status: 200,
//       data,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({
//       message: `Failed to retrieve users: ${error}`,
//       status: 500,
//     });
//   }
// }
