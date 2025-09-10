"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react"; // nicer remove icon

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
};

// ✅ Gradient Loader Component (reusable)
function GradientLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-48 md:h-48 w-32 h-32 aspect-square rounded-full">
        <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 backdrop-blur-md"></div>
      </div>
    </div>
  );
}

export default function MyListPage() {
  const [myList, setMyList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true); // ✅ start with loading true

  // Load saved list from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("myAnimeList");
    if (stored) {
      setMyList(JSON.parse(stored));
    }
    setLoading(false); // ✅ stop loading after localStorage check
  }, []);

  // Remove anime from list
  const removeFromList = (id: number) => {
    const updatedList = myList.filter((anime) => anime.mal_id !== id);
    setMyList(updatedList);
    localStorage.setItem("myAnimeList", JSON.stringify(updatedList));
  };

  // 🚨 Show full screen loader while list is being prepared
  if (loading) {
    return <GradientLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f1f] to-indigo-900 text-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-300 mb-10 drop-shadow-lg">
          My Anime List
        </h1>

        {myList.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">
            You haven’t added any anime yet. Go explore and add your favorites!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {myList.map((anime) => (
              <div
                key={anime.mal_id}
                className="relative group rounded-2xl overflow-hidden border border-indigo-700/40 shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 bg-white/5 backdrop-blur-md"
              >
                {/* Remove button (top-right) */}
                <button
                  onClick={() => removeFromList(anime.mal_id)}
                  className="absolute top-3 right-3 z-20 bg-indigo-800/70 hover:bg-red-500 hover:scale-110 transition-all p-2 rounded-full shadow-md"
                  title="Remove from list"
                >
                  <Trash2 size={16} className="text-white" />
                </button>

                {/* Anime Poster */}
                <Link href={`/anime/${anime.mal_id}`}>
                  <div className="relative w-full h-72">
                    <Image
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      fill
                      className="object-cover rounded-t-2xl group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <div className="p-4 text-center">
                    <h2 className="text-sm sm:text-base font-semibold text-indigo-100 group-hover:text-indigo-300 line-clamp-2">
                      {anime.title}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
