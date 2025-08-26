import React from "react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md ">
      {/* Left side: Brand + Links */}
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold tracking-wide hover:text-indigo-400 cursor-pointer">
          ANIMAZE
        </div>
        <Link href="/anime/topanime">
          <div className="text-lg font-medium hover:text-indigo-400 cursor-pointer">
            Top Anime
          </div>
        </Link>
      </div>

      {/* Right side: Sign Out */}
      <div>
        <Link href="/">
          <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow">
            Sign Out
          </button>
        </Link>
      </div>
    </div>
  );
}
