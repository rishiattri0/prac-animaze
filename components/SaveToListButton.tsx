"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [justChanged, setJustChanged] = useState(false);

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
    } else {
      // Add
      localStorage.setItem("myAnimeList", JSON.stringify([...current, anime]));
      setInList(true);
    }

    // Trigger animation
    setJustChanged(true);
    setTimeout(() => setJustChanged(false), 1000);
  };

  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault(); // prevent Link navigation
        handleToggle();
      }}
      whileTap={{ scale: 0.9 }}
      animate={
        justChanged
          ? {
              scale: [1, 1.2, 1],
              backgroundColor: inList ? "#dc2626" : "#4f46e5",
            }
          : {}
      }
      transition={{ duration: 0.4 }}
      className={`mt-2 py-1 px-3 rounded-lg text-sm text-white transition ${
        inList
          ? "bg-red-600 hover:bg-red-700"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      {inList ? "❌ Remove from List" : "➕ Add to My List"}
    </motion.button>
  );
}
