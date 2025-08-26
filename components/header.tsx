"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Navbar() {
  // Track auth state (replace later with real auth, e.g. NextAuth)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuth = () => {
    if (isLoggedIn) {
      // Logout
      setIsLoggedIn(false);
    } else {
      // Login (in real app you'd redirect to sign in page)
      setIsLoggedIn(true);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#0f172a] text-white shadow-md">
      {/* Left side: Brand + Links */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:text-indigo-400"
        >
          ANIMAZE
        </Link>

        <Link
          href="/anime/topanime"
          className="text-lg font-medium hover:text-indigo-400"
        >
          Top Anime
        </Link>

        <Link
          href="/anime"
          className="text-lg font-medium hover:text-indigo-400"
        >
          Browse
        </Link>
      </div>

      {/* Right side: Sign In / Logout button */}
      <div>
        <button
          onClick={handleAuth}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition duration-200 shadow"
        >
          {isLoggedIn ? "Logout" : "Sign In"}
        </button>
      </div>
    </nav>
  );
}
