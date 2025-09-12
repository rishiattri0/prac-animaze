"use client";

import { useEffect, useState } from "react";
import GradientLoader from "@/components/loader";
import AnimeCard from "@/components/AnimeCard"; // 👈 unified card

interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  episodes: number | null;
  status: string;
}

export default function TopAnime() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnime = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/top/anime?page=${pageNum}&limit=12`
      );
      const data = await res.json();

      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setAnimeList((prev) => {
          const newList = [...prev, ...data.data];
          const unique = Array.from(
            new Map(newList.map((a) => [a.mal_id, a])).values()
          );
          return unique;
        });
      }
    } catch (err) {
      console.error("Failed to fetch anime:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  if (loading && animeList.length === 0) {
    return <GradientLoader />;
  }

  return (
    <main className="p-8 bg-gradient-to-b from-black to-indigo-950 min-h-screen">
      <h1 className="text-3xl font-extrabold text-indigo-200 mb-8">
        Top Anime
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {/* Loader */}
      {loading && animeList.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* End */}
      {!hasMore && (
        <p className="text-center text-gray-500 mt-6">
          🎉 You’ve reached the end!
        </p>
      )}
    </main>
  );
}
