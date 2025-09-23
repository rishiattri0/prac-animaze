"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const [navH, setNavH] = useState(0);

  const { isSignedIn } = useUser();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => setNavH(el.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const links = [
    { name: "Home", path: "/", protected: false },
    { name: "Anime", path: "/anime/topanime", protected: true },
    { name: "Manga", path: "/manga", protected: true },
    { name: "Airing", path: "/anime", protected: true },
    { name: "Anime-List", path: "/anime/mylist", protected: true },
    { name: "Manga-List", path: "/manga/mangalist", protected: true },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className="bg-gradient-to-r from-black via-gray-950 to-blue-950 text-white shadow-lg shadow-blue-900/30 backdrop-blur-md fixed inset-x-0 top-0 z-50"
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          {/* Logo */}
          <Link href="/" aria-label="Go to homepage">
            <div
              className="font-extrabold text-2xl tracking-wide cursor-pointer 
              bg-gradient-to-r from-sky-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent 
              hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)] transition"
            >
              ANIMAZE
            </div>
          </Link>

          {/* Hamburger – only mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="main-nav"
          >
            <svg
              className="w-7 h-7 text-sky-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  open
                    ? "M6 18L18 6M6 6l12 12" // close
                    : "M4 6h16M4 12h16M4 18h16" // hamburger
                }
              />
            </svg>
          </button>

          {/* Links + Auth */}
          <nav
            id="main-nav"
            className={cn(
              "absolute md:static left-0 w-full md:w-auto flex-col md:flex md:flex-row md:items-center md:space-x-10 font-medium transition-all duration-300 ease-in-out overflow-hidden",
              open
                ? "top-16 opacity-100 bg-gradient-to-r from-black via-gray-950 to-blue-950 z-50 py-4"
                : "top-[-400px] opacity-0 md:opacity-100 md:top-auto md:bg-transparent"
            )}
          >
            {links.map((item) => {
              const targetPath =
                item.protected && !isSignedIn ? "/sign-in" : item.path;

              return (
                <Link
                  key={item.name}
                  href={targetPath}
                  onClick={() => setOpen(false)}
                >
                  <span
                    className="block px-6 py-2 md:px-0 md:py-0 
                    text-gray-300 hover:text-sky-400 transition duration-200 cursor-pointer 
                    hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Clerk Auth */}
            <div className="flex items-center gap-3 px-6 md:px-0 mt-4 md:mt-0">
              <SignedOut>
                <div className="flex items-center gap-3 px-6 md:px-0 mt-4 md:mt-0">
                  <Link href="/sign-in">
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-full hover:bg-sky-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-sky-900/30">
                      Sign In
                    </button>
                  </Link>

                  <Link href="/sign-up">
                    <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md shadow-indigo-900/30">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: navH }} aria-hidden />
    </>
  );
}
