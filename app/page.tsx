"use client";

import { useEffect, useState } from "react";
import { CardCarousel } from "@/components/ui/card-carousel";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

export default function LandingPage() {
  const [animeImages, setAnimeImages] = useState<
    { src: string; alt: string }[]
  >([]);

  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        const res = await fetch(
          "https://api.jikan.moe/v4/top/anime?filter=favorite&limit=10"
        );
        const data = await res.json();
        const formatted = data.data.map((anime: Anime) => ({
          src: anime.images.jpg.large_image_url,
          alt: anime.title,
        }));
        setAnimeImages(formatted);
      } catch (error) {
        console.error("Error fetching popular anime:", error);
      }
    };

    fetchPopularAnime();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="text-center mt-16">
        <h1 className="text-5xl font-bold">
          Seasonal <span className="text-indigo-400">Anime</span> Tracker
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Stay updated with the latest anime releases.
        </p>
        <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl">
          Sign in to Continue
        </button>
      </section>

      {/* Features Section (your previous feature cards here) */}

      {/* Popular Anime Carousel */}
      <section className="mt-20 w-full max-w-5xl">
        {animeImages.length > 0 ? (
          <CardCarousel images={animeImages} autoplayDelay={2000} />
        ) : (
          <p className="text-gray-400">Loading popular anime...</p>
        )}
      </section>
    </main>
  );
}
