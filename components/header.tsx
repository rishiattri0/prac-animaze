// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="p-4 md:p-5 bg-gradient-to-r from-black via-gray-900 to-indigo-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="font-bold text-2xl tracking-wide cursor-pointer hover:text-indigo-400 transition">
            ANIMAZE
          </div>
        </Link>

        {/* Hamburger – visible only on small screens */}
        <button
          className="md:hidden p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Links – horizontal on md+, stacked on mobile when open */}
        <nav
          className={`${
            open
              ? "absolute top-16 left-0 w-full bg-gradient-to-r from-black via-gray-900 to-indigo-900 z-50"
              : "hidden"
          } md:static md:block md:w-auto md:bg-transparent`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-8 p-4 md:p-0 font-medium">
            {[
              { name: "Home", path: "/" },
              { name: "Top Anime", path: "/anime/topanime" },
              { name: "Browse", path: "/anime" },
              { name: "Sign In", path: "/signin" },
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <span className="block py-2 md:py-0 hover:text-indigo-400 transition cursor-pointer">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
