"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ReactNode } from "react";
import GradientLoader from "@/components/loader";

// ✅ Reusable Gradient Loader

export function Header1({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-3xl font-bold text-center my-6 text-white">
      {children}
    </h1>
  );
}

export default function MangaPage() {
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loader = useRef<HTMLDivElement>(null);

  // Track already added manga by mal_id
  const seenIds = useRef<Set<number>>(new Set());

  const fetchManga = async (pageNum: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/top/manga?page=${pageNum}`
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
      const newManga = data.data.filter((manga: any) => {
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

  // Fetch first page
  useEffect(() => {
    fetchManga(1);
  }, []);

  // Fetch when page increments
  useEffect(() => {
    if (page > 1) {
      fetchManga(page);
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

  // 🚨 Full screen loader on first load
  if (loading && mangaList.length === 0) {
    return <GradientLoader />;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-indigo-200 p-7">Manga</h1>

      <main className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {mangaList.map((manga) => (
          <Link href={`/manga/${manga.mal_id}`} key={manga.mal_id}>
            <div className="bg-black rounded-xl shadow p-4 flex flex-col shadow-cyan-100/100 hover:scale-105 transition">
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
                className="font-bold text-center mt-2 truncate"
                title={manga.title}
              >
                {manga.title}
              </h2>
              <p className="text-center">Chapters: {manga.chapters ?? "?"}</p>
              <p className="text-center">Volumes: {manga.volumes ?? "?"}</p>
              <p className="text-center">Status: {manga.status}</p>
            </div>
          </Link>
        ))}

        {/* Invisible sentinel */}
        <div ref={loader} className="h-10" />
      </main>

      {/* Inline loader while scrolling */}
      {loading && mangaList.length > 0 && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
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

      {/* No more results */}
      {!hasMore && !loading && mangaList.length > 0 && (
        <p className="text-center py-4 text-gray-500">
          🎉 You've seen all the top manga!
        </p>
      )}

      {!hasMore && !loading && mangaList.length === 0 && (
        <p className="text-center py-4 text-gray-500">No manga found.</p>
      )}
    </div>
  );
}
