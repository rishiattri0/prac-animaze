"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react"; // Remove icon
import GradientLoader from "@/components/loader";

// ✅ Manga type
type Manga = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
};

export default function MyMangaListPage() {
  const [myList, setMyList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved manga list from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("myMangaList");
    if (stored) {
      setMyList(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  // Remove manga from list
  const removeFromList = (id: number) => {
    const updatedList = myList.filter((manga) => manga.mal_id !== id);
    setMyList(updatedList);
    localStorage.setItem("myMangaList", JSON.stringify(updatedList));
  };

  // Loader while preparing list
  if (loading) {
    return <GradientLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f1f] to-purple-900 text-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-purple-300 mb-10 drop-shadow-lg">
          My Manga List
        </h1>

        {myList.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">
            You haven’t added any manga yet. Go explore and add your favorites!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {myList.map((manga) => (
              <div
                key={manga.mal_id}
                className="relative group rounded-2xl overflow-hidden border border-purple-700/40 shadow-lg hover:shadow-purple-500/40 transition-all duration-300 bg-white/5 backdrop-blur-md"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromList(manga.mal_id)}
                  className="absolute top-3 right-3 z-20 bg-purple-800/70 hover:bg-red-500 hover:scale-110 transition-all p-2 rounded-full shadow-md"
                  title="Remove from list"
                >
                  <Trash2 size={16} className="text-white" />
                </button>

                {/* Manga Poster */}
                <Link href={`/manga/${manga.mal_id}`}>
                  <div className="relative w-full h-72">
                    <Image
                      src={manga.images.jpg.large_image_url}
                      alt={manga.title}
                      fill
                      className="object-cover rounded-t-2xl group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Title */}
                  <div className="p-4 text-center">
                    <h2 className="text-sm sm:text-base font-semibold text-purple-100 group-hover:text-purple-300 line-clamp-2">
                      {manga.title}
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
