"use client";

import { useEffect, useState } from "react";
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

  // ----------------- FETCH RECOMMENDATIONS -----------------
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch(
          "https://api.jikan.moe/v4/recommendations/anime"
        );
        const data: { data: Recommendation[] } = await res.json(); // 👈 type the response

        // ✅ Filter unique by mal_id
        const uniqueRecs: Recommendation[] = Array.from(
          new Map(data.data.map((rec) => [rec.entry[0]?.mal_id, rec])).values()
        );

        // ✅ Take only first 20
        setRecommendations(uniqueRecs.slice(0, 10));
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

      setAnimeList((prev) => {
        const newList = [...prev, ...data.data];
        // ✅ remove duplicates
        const unique = Array.from(
          new Map(newList.map((a) => [a.mal_id, a])).values()
        );
        return unique;
      });
    } catch (err) {
      console.error("Error fetching anime:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAnime(page);
  }, [page]);

  // ----------------- INFINITE SCROLL HANDLER -----------------
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
                link: `/anime/${rec.entry[0]?.mal_id}`, // goes to your [id] page
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
        </main>
      </section>

      {/* Inline loader */}
      {loading && animeList.length > 0 && (
        <div className="flex justify-center mt-6">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
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

      {/* End of list */}
      {!hasMore && !loading && (
        <p className="text-center text-gray-500 mt-6">
          🎉 You've seen all the anime!
        </p>
      )}
    </div>
  );
}
