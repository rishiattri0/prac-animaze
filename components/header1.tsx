import React from "react";
import Link from "next/link";

export function Header1() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      <div className="text-2xl font-bold tracking-wide hover:text-indigo-400 cursor-pointer">
        ANIMAZE
      </div>

      <div>
        <Link href="/signin">
          <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow">
            Sign In
          </button>
        </Link>
      </div>

      
    </div>
  );
}
