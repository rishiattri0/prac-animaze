"use client";

import Link from "next/link";
import SaveToListButton from "@/components/SaveToListButton";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  episodes?: number;
  status?: string;
}

export default function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="bg-indigo-950/40 rounded-xl shadow shadow-indigo-500/40 p-4 flex flex-col hover:scale-105 transition">
        {/* Image */}
        <div className="w-full aspect-[3/4] overflow-hidden rounded-lg">
          <img
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            width={300}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Title */}
        <h2 className="font-bold text-center mt-3 truncate" title={anime.title}>
          {anime.title}
        </h2>

        {/* Meta info */}
        <p className="text-center text-gray-300">
          Episodes: {anime.episodes ?? "?"}
        </p>
        <p className="text-center text-gray-300">Status: {anime.status}</p>

        {/* Save Button */}
        <SaveToListButton anime={anime} />
      </div>
    </Link>
  );
}
