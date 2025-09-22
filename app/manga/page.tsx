"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GradientLoader from "@/components/loader";
import { RecommendationCarousel } from "@/components/recommendation-carousel";
import MangaCard from "@/components/MangaCard"; // 👈 new card

// ----------------- TYPES -----------------
interface Manga {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  chapters: number | null;
  volumes: number | null;
  status: string;
  score?: number | null;
}

interface Recommendation {
  entry: {
    mal_id: number;
    title: string;
    url: string;
    images?: { jpg?: { large_image_url?: string } };
  }[];
  content: string;
}

export default function MangaPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement>(null);
  const seenIds = useRef<Set<number>>(new Set());

  // ---------------- FETCH RECOMMENDATIONS ----------------
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch(
          "https://api.jikan.moe/v4/recommendations/manga"
        );
        const data: { data: Recommendation[] } = await res.json();

        const uniqueRecs: Recommendation[] = Array.from(
          new Map(data.data.map((rec) => [rec.entry[0]?.mal_id, rec])).values()
        );

        setRecommendations(uniqueRecs.slice(0, 10));
      } catch (err) {
        console.error("Error fetching manga recommendations:", err);
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecs();
  }, []);

  // ---------------- FETCH MANGA ----------------
  const fetchManga = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/top/manga?page=${pageNum}`
      );
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();
      if (!data.data || data.data.length === 0) {
        setHasMore(false);
        return;
      }

      const newManga = data.data.filter((manga: Manga) => {
        if (seenIds.current.has(manga.mal_id)) return false;
        seenIds.current.add(manga.mal_id);
        return true;
      });

      if (newManga.length === 0 && pageNum > 1) {
        setHasMore(false);
        return;
      }

      setMangaList((prev) => [...prev, ...newManga]);
    } catch (err) {
      console.error("Error fetching manga:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // first page
  useEffect(() => {
    fetchManga(1);
  }, []);

  // page increment
  useEffect(() => {
    if (page > 1) fetchManga(page);
  }, [page]);

  // infinite scroll
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

  // 🚨 Full screen loader
  if (loading && mangaList.length === 0) {
    return <GradientLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-indigo-900 text-white">
      {/* 🔹 Recommendations Section */}
      <section className="py-14">
        <h1 className="text-4xl font-extrabold text-center text-indigo-200 mb-10">
          📚 Manga Picks For You
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
                link: `/manga/${rec.entry[0]?.mal_id}`,
              }))}
            />
          </div>
        )}
      </section>

      {/* 🔹 Top Manga Section */}
      <h2 className="text-3xl font-extrabold text-indigo-200 text-center py-10">
        📖 Top Manga
      </h2>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        {mangaList.map((manga) => (
          <MangaCard key={manga.mal_id} manga={manga} />
        ))}
        <div ref={loader} className="h-10" />
      </main>

      {/* inline loader */}
      {loading && mangaList.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <GradientLoader />
        </div>
      )}

      {/* error */}
      {error && !loading && (
        <p className="text-center py-4 text-red-500">
          ❌ {error}{" "}
          <button
            onClick={() => fetchManga(page)}
            className="underline text-white"
          >
            Retry
          </button>
        </p>
      )}

      {/* no more results */}
      {!hasMore && !loading && mangaList.length > 0 && (
        <p className="text-center py-4 text-gray-500">
          🎉 You've seen all the manga!
        </p>
      )}
      {!hasMore && !loading && mangaList.length === 0 && (
        <p className="text-center py-4 text-gray-500">No manga found.</p>
      )}
    </div>
  );
}
