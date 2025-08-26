"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header2 } from "@/components/header2";

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

  // Fetch top anime
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
          // ✅ remove duplicates by mal_id
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

  // Infinite scroll
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

  return (
    <div>
      <main className="p-8 bg-gradient-to-b from-black to-indigo-950 min-h-screen">
        <h1 className="text-3xl font-bold text-indigo-200 mb-8">
          📊 Top Anime
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {animeList.map((anime) => (
            <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id}>
              <div className="bg-black rounded-xl shadow p-4 flex flex-col shadow-cyan-100/40 hover:shadow-cyan-300/70 hover:-translate-y-2 transform transition duration-300">
                <div className="w-full aspect-[3/4] overflow-hidden rounded-lg">
                  <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h2
                  className="font-bold text-center mt-2 truncate text-indigo-100"
                  title={anime.title}
                >
                  {anime.title}
                </h2>
                <p className="text-center text-gray-400 text-sm">
                  Episodes: {anime.episodes ?? "?"}
                </p>
                <p className="text-center text-gray-400 text-sm">
                  Status: {anime.status}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {!hasMore && (
          <p className="text-center text-gray-500 mt-6">
            🎉 You’ve reached the end!
          </p>
        )}
      </main>
    </div>
  );
}
