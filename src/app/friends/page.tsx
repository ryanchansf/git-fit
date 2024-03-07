"use client";
import Following from "../following/page";
import Followers from "../followers/page";

export default function Friends() {
  return (
    <div className="flex">
      <div className="flex-1">
        <Followers />
      </div>
      <div className="flex-1">
        <Followers />
      </div>
    </div>
  );
}
