"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/header";

export default function AnimePage() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement>(null);

  // Track already added anime by mal_id
  const seenIds = useRef<Set<number>>(new Set());

  const fetchAnime = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/seasons/now?page=${pageNum}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      if (!data.data || data.data.length === 0) {
        setHasMore(false);
        return;
      }

      // Filter duplicates
      const newAnime = data.data.filter((anime: any) => {
        if (seenIds.current.has(anime.mal_id)) return false;
        seenIds.current.add(anime.mal_id);
        return true;
      });

      // If it's the very first fetch and everything was duplicate → don't kill hasMore
      if (newAnime.length === 0 && pageNum === 1) {
        return;
      }

      if (newAnime.length === 0 && pageNum > 1) {
        setHasMore(false);
        return;
      }

      setAnimeList((prev) => [...prev, ...newAnime]);
    } catch (err) {
      console.error("Error fetching anime:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch page 1 immediately on mount
  useEffect(() => {
    fetchAnime(1);
  }, []);

  // Fetch when page increments
  useEffect(() => {
    if (page > 1) {
      fetchAnime(page);
    }
  }, [page]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, hasMore]);

  return (
    <div>
      <Header />
      <main className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {animeList.map((anime) => (
          <div
            key={anime.mal_id}
            className="bg-black rounded-xl shadow p-4 flex flex-col shadow-cyan-100/100"
          >
            <div className="w-full aspect-[3/4] overflow-hidden rounded-lg ">
              <img
                src={anime.images?.jpg.large_image_url}
                alt={anime.title}
                width={500}
                height={400}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            <h2
              className="font-bold text-center mt-2 truncate"
              title={anime.title}
            >
              {anime.title}
            </h2>
            <p className="text-center">Episodes: {anime.episodes ?? "?"}</p>
            <p className="text-center">Status: {anime.status}</p>
          </div>
        ))}

        {/* Invisible sentinel */}
        <div ref={loader} className="h-10" />
      </main>

      {/* Loading */}
      {loading && <p className="text-center py-4">Loading more anime...</p>}

      {/* Error */}
      {error && !loading && (
        <p className="text-center py-4 text-red-500">
          ❌ {error}{" "}
          <button
            onClick={() => fetchAnime(page)}
            className="underline text-white"
          >
            Retry
          </button>
        </p>
      )}

      {/* No more anime */}
      {!hasMore && !loading && animeList.length > 0 && (
        <p className="text-center py-4 text-gray-500">
          🎉 You've seen all the anime!
        </p>
      )}

      {/* No results */}
      {!hasMore && !loading && animeList.length === 0 && (
        <p className="text-center py-4 text-gray-500">
          No anime found for this season.
        </p>
      )}
    </div>
  );
}
