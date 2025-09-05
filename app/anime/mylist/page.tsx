"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

export default function MyListPage() {
  const [myList, setMyList] = useState<Anime[]>([]);

  // Load saved list from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("myAnimeList");
    if (stored) {
      setMyList(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f1f] to-indigo-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-200 mb-6">
          My Anime List
        </h1>

        {myList.length === 0 ? (
          <p className="text-gray-400">You haven’t added any anime yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {myList.map((anime) => (
              <Link
                href={`/anime/${anime.mal_id}`}
                key={anime.mal_id}
                className="bg-[#0d1324]/80 rounded-xl overflow-hidden shadow-lg border border-indigo-800/40 hover:scale-105 transition-transform"
              >
                <Image
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <div className="p-3 text-center text-sm text-indigo-200 font-semibold">
                  {anime.title}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
