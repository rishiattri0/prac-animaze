import Link from "next/link";
import { Header1 } from "@/components/header1";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black to-indigo-800 text-white">
        <h1 className="text-5xl font-bold mb-6">Seasonal Anime Tracker</h1>
        <p className="mb-4 text-lg">
          Stay updated with the latest anime this season
        </p>
        <Link href="/signin">
          <button className="px-6 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800">
            Sign in to Continue
          </button>
        </Link>
      </main>
    </div>
  );
}
