import React from "react";
import Link from "next/link";

export function Header2() {
  return (
    <Link href="/anime">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
        <div className="text-2xl font-bold tracking-wide hover:text-indigo-400 cursor-pointer">
          ANIMAZE
        </div>
      </div>
    </Link>
  );
}
