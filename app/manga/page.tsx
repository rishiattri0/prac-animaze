"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GradientLoader from "@/components/loader";

interface Manga {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
  chapters: number | null;
  volumes: number | null;
  status: string;
}

export default function MangaPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement>(null);

  const seenIds = useRef<Set<number>>(new Set());

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
      <h1 className="text-3xl font-extrabold text-indigo-200 text-center py-10">
        📚 Top Manga
      </h1>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        {mangaList.map((manga) => (
          <Link href={`/manga/${manga.mal_id}`} key={manga.mal_id}>
            <div className="bg-indigo-950/40 rounded-xl shadow shadow-indigo-500/40 p-4 flex flex-col hover:scale-105 transition">
              <div className="w-full aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={manga.images.jpg.large_image_url}
                  alt={manga.title}
                  width={300}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2
                className="font-bold text-center mt-3 truncate"
                title={manga.title}
              >
                {manga.title}
              </h2>
              <p className="text-center text-gray-300">
                Chapters: {manga.chapters ?? "?"}
              </p>
              <p className="text-center text-gray-300">
                Volumes: {manga.volumes ?? "?"}
              </p>
              <p className="text-center text-gray-300">
                Status: {manga.status}
              </p>
            </div>
          </Link>
        ))}

        {/* sentinel for infinite scroll */}
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
