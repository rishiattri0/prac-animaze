"use client";

import { useEffect, useRef, useState } from "react";
import GradientLoader from "@/components/loader";
import { RecommendationCarousel } from "@/components/recommendation-carousel";
import AnimeCard from "@/components/AnimeCard"; // 👈 unified card

// ----------------- TYPES -----------------
interface Recommendation {
  entry: {
    mal_id: number;
    title: string;
    url: string;
    images?: { jpg?: { large_image_url?: string } };
  }[];
  content: string;
}

export default function AnimePage() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  const loader = useRef<HTMLDivElement>(null);
  const seenIds = useRef<Set<number>>(new Set());

  // ----------------- FETCH RECOMMENDATIONS -----------------
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch(
          "https://api.jikan.moe/v4/recommendations/anime"
        );
        const data = await res.json();
        setRecommendations(data.data.slice(0, 8)); // only first 8 recs
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecs();
  }, []);

  // ----------------- FETCH SEASONAL ANIME -----------------
  const fetchAnime = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/seasons/now?page=${pageNum}`
      );
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      if (!data.data || data.data.length === 0) {
        setHasMore(false);
        return;
      }

      const newAnime = data.data.filter((anime: any) => {
        if (seenIds.current.has(anime.mal_id)) return false;
        seenIds.current.add(anime.mal_id);
        return true;
      });

      if (newAnime.length === 0) {
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

  // Fetch first page
  useEffect(() => {
    fetchAnime(1);
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (page > 1) fetchAnime(page);
  }, [page]);

  // ----------------- INFINITE SCROLL OBSERVER -----------------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px", threshold: 0 } // 👈 load before fully reaching bottom
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, hasMore]);

  // ----------------- UI -----------------
  if (loading && animeList.length === 0) return <GradientLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-indigo-900 text-white">
      {/* 🔹 Recommendations Section */}
      <section className="py-14">
        <h1 className="text-4xl font-extrabold text-center text-indigo-200 mb-10">
          ✨ Top Picks For You
        </h1>
        {recLoading ? (
          <p className="text-center text-gray-400">
            Loading recommendations...
          </p>
        ) : (
          <div className="flex justify-center">
            <RecommendationCarousel
              items={recommendations.map((rec) => ({
                src:
                  rec.entry[0]?.images?.jpg?.large_image_url ?? "/fallback.jpg",
                alt: rec.entry[0]?.title ?? "Unknown",
                code: rec.content,
                link: rec.entry[0]?.url ?? "#",
              }))}
            />
          </div>
        )}
      </section>

      {/* 🔹 Currently Airing Section */}
      <section className="px-6 py-12">
        <h2 className="text-3xl font-bold text-indigo-200 text-center mb-8">
          📺 Currently Airing
        </h2>
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {animeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
          {/* Infinite Scroll Sentinel */}
          <div ref={loader} className="h-20 w-full" />
        </main>
      </section>

      {/* Inline Loader */}
      {loading && animeList.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <GradientLoader />
        </div>
      )}

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

      {/* No More Anime */}
      {!hasMore && !loading && animeList.length > 0 && (
        <p className="text-center py-4 text-gray-500">
          🎉 You've seen all the anime!
        </p>
      )}

      {/* No Results */}
      {!hasMore && !loading && animeList.length === 0 && (
        <p className="text-center py-4 text-gray-500">
          No anime found for this season.
        </p>
      )}
    </div>
  );
}
