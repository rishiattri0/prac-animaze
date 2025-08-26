import Link from "next/link";
import { Header1 } from "@/components/header1";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-br from-black via-indigo-900 to-indigo-800 text-white">
        {/* Hero Section */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
          Seasonal <span className="text-indigo-400">Anime</span> Tracker
        </h1>
        <p className="mb-8 text-base sm:text-lg md:text-xl max-w-2xl">
          Stay updated with the{" "}
          <span className="text-indigo-300">latest anime releases </span>
          and never miss an episode this season.
        </p>

        {/* CTA Button */}
        <Link href="/signin">
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg transition transform hover:scale-105">
            Sign in to Continue
          </button>
        </Link>

        {/* Decorative Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <div className="bg-gray-900/70 p-6 rounded-xl shadow hover:shadow-indigo-500/50 transition">
            <h3 className="text-xl font-bold mb-2">📺 Track Episodes</h3>
            <p className="text-gray-300 text-sm">
              Keep a record of what you’re watching and stay synced across
              devices.
            </p>
          </div>
          <div className="bg-gray-900/70 p-6 rounded-xl shadow hover:shadow-indigo-500/50 transition">
            <h3 className="text-xl font-bold mb-2">🔥 Seasonal Updates</h3>
            <p className="text-gray-300 text-sm">
              Always know what’s trending in the anime world each season.
            </p>
          </div>
          <div className="bg-gray-900/70 p-6 rounded-xl shadow hover:shadow-indigo-500/50 transition">
            <h3 className="text-xl font-bold mb-2">🌟 Favorites List</h3>
            <p className="text-gray-300 text-sm">
              Save your top anime in a personal watchlist for quick access.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
