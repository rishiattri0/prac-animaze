"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react"; // icons

interface Manga {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  chapters: number | null;
  volumes: number | null;
  status: string;
  score?: number | null;
}

export default function MangaCard({ manga }: { manga: Manga }) {
  const [inList, setInList] = useState(false);

  // ✅ Check if already in My List
  useEffect(() => {
    const stored = localStorage.getItem("myMangaList");
    if (stored) {
      const parsed = JSON.parse(stored);
      setInList(parsed.some((item: Manga) => item.mal_id === manga.mal_id));
    }
  }, [manga.mal_id]);

  // ✅ Add to List
  const addToList = () => {
    const stored = localStorage.getItem("myMangaList");
    let list = stored ? JSON.parse(stored) : [];
    if (!list.some((item: Manga) => item.mal_id === manga.mal_id)) {
      list.push(manga);
      localStorage.setItem("myMangaList", JSON.stringify(list));
      setInList(true);
    }
  };

  return (
    <div className="bg-indigo-950/40 rounded-xl shadow shadow-indigo-500/40 p-4 flex flex-col hover:scale-105 transition relative">
      {/* Poster */}
      <Link href={`/manga/${manga.mal_id}`}>
        <div className="w-full aspect-[3/4] overflow-hidden rounded-lg">
          <Image
            src={manga.images.jpg.large_image_url}
            alt={manga.title}
            width={300}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      {/* Info */}
      <h2 className="font-bold text-center mt-3 truncate" title={manga.title}>
        {manga.title}
      </h2>
      <p className="text-center text-gray-300">
        Chapters: {manga.chapters ?? "?"}
      </p>
      <p className="text-center text-gray-300">
        Volumes: {manga.volumes ?? "?"}
      </p>
      <p className="text-center text-gray-300">Status: {manga.status}</p>
      <p className="text-center text-yellow-400 font-semibold">
        ⭐ Score: {manga.score ?? "N/A"}
      </p>

      {/* Add button */}
      <button
        onClick={addToList}
        disabled={inList}
        className={`mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition ${
          inList
            ? "bg-green-600/80 text-white cursor-default"
            : "bg-indigo-700 hover:bg-indigo-600 text-white"
        }`}
      >
        {inList ? <Check size={16} /> : <Plus size={16} />}
        {inList ? "Added" : "Add to List"}
      </button>
    </div>
  );
}
