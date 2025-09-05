"use client";

import { useEffect, useState } from "react";

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  episodes?: number | null;
  status?: string;
};

export default function SaveToListButton({ anime }: { anime: Anime }) {
  const [inList, setInList] = useState(false);

  // Check if anime is already saved
  useEffect(() => {
    const stored = localStorage.getItem("myAnimeList");
    if (stored) {
      const current = JSON.parse(stored);
      setInList(current.some((a: Anime) => a.mal_id === anime.mal_id));
    }
  }, [anime.mal_id]);

  const handleToggle = () => {
    const stored = localStorage.getItem("myAnimeList");
    const current = stored ? JSON.parse(stored) : [];

    if (inList) {
      // Remove
      const updated = current.filter((a: Anime) => a.mal_id !== anime.mal_id);
      localStorage.setItem("myAnimeList", JSON.stringify(updated));
      setInList(false);
      alert("Removed from your list ❌");
    } else {
      // Add
      localStorage.setItem("myAnimeList", JSON.stringify([...current, anime]));
      setInList(true);
      alert("Added to your list 🎉");
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent Link navigation
        handleToggle();
      }}
      className={`mt-2 py-1 px-3 rounded-lg text-sm transition ${
        inList
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-indigo-600 hover:bg-indigo-700 text-white"
      }`}
    >
      {inList ? "❌ Remove from List" : "➕ Add to My List"}
    </button>
  );
}
