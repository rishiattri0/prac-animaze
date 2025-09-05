"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string; // use high quality image
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
        <h1 className="text-4xl font-extrabold text-indigo-200 mb-8">
          My Anime List
        </h1>

        {myList.length === 0 ? (
          <p className="text-gray-400">You haven’t added any anime yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {myList.map((anime) => (
              <Link
                href={`/anime/${anime.mal_id}`}
                key={anime.mal_id}
                className="group bg-[#0d1324]/80 rounded-2xl overflow-hidden shadow-lg border border-indigo-800/40 hover:shadow-indigo-500/30 transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="relative w-full h-72">
                  <Image
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    fill
                    className="object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center text-sm font-semibold text-indigo-100 group-hover:text-indigo-300 line-clamp-2">
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
