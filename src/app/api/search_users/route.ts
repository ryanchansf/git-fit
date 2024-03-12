import connectDB from "@/database/db";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     console.log("here bruh");
//     const db = connectDB();
//     if (!db) {
//       throw new Error("Failed to connect to the database");
//     }
//     console.log("fed up");
//     const { username } = await req.json();
//     console.log(username);
//     console.log("overthissss");

//     if (!username) {
//       throw new Error("Missing username");
//     }
//     const { data: results, error } = await db
//       .from("users")
//       .select("*")
//       .match({ username: username });

//     if (error) {
//       throw error;
//     }
//     return NextResponse.json({
//       message: "User displayed",
//       status: 200,
//       results,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({
//       message: `Failed to find user: ${error}`,
//       status: 500,
//     });
//   }
// }

// export async function GET(req: Request) {
//   try {
//     const db = connectDB();
//     console.log("here brub");
//     console.log("request: ", req.body);
//     if (!db) {
//       throw new Error("Failed to connect to the database");
//     }
//     const { target } = await req.json();
//     console.log("target: ", target);
//     const { data, error } = await db
//       .from("users")
//       .select("*")
//       .match({ username: target });
//     if (error) {
//       throw error;
//     }
//     return NextResponse.json({
//       message: `Search succesfully completed`,
//       status: 200,
//     });
//   } catch (error) {
//     console.error(error); // Log the error to the console
//     return NextResponse.json({
//       message: `Failed to search users database`,
//       status: 500,
//     });
//   }
// }
export async function GET(req: NextRequest) {
  try {
    console.log("hereeeee");
    const supabase = connectDB();
    const url = new URL(req.url ? req.url : "invalid");
    const username = url.searchParams.get("username");

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
