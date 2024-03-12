"use client";
import { useSession } from "next-auth/react";
import Unauthorized from "@/components/unauthorized";
import Following from "../following/page";
import Followers from "../followers/page";
import Search from "../search/page";

export default function Friends() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  return (
    <div>
      {username ? (
        <div className="flex">
          <div className="flex-1">
            <Followers />
          </div>
          <div className="flex-1">
            <Following />
          </div>
          <div>
            <Search />
          </div>
        </div>
      ) : (
        <Unauthorized />
      )}
    </div>
  );
}
