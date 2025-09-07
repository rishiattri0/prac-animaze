"use client";

import { useEffect, useState } from "react";
import { CardCarousel } from "@/components/ui/card-carousel";
import Button from "@/components/button";
import Link from "next/link";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

export default function LandingPageContent() {
  const [animeImages, setAnimeImages] = useState<
    { src: string; alt: string }[]
  >([]);
  const { isSignedIn } = useUser();
  const router = useRouter();

  // 🚀 Redirect if signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push("/anime");
    }
  }, [isSignedIn, router]);

  // 🎬 Fetch seasonal anime
  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/seasons/now");
        const data = await res.json();

        if (Array.isArray(data?.data)) {
          const formatted = data.data.map((anime: Anime) => ({
            src: anime.images.jpg.large_image_url,
            alt: anime.title,
          }));
          setAnimeImages(formatted);
        } else {
          console.error("Unexpected response:", data);
        }
      } catch (error) {
        console.error("Error fetching popular anime:", error);
      }
    };

    fetchPopularAnime();
  }, []);

  // ⛔ Prevent flash of landing page for signed-in users
  if (isSignedIn) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-indigo-950 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="text-center mt-20 px-4">
        <TypingAnimation>Seasonal Anime Tracker</TypingAnimation>

        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          Stay updated with the latest anime releases, rankings and more.
        </p>

        <Link href="/sign-in">
          <Button />
        </Link>
      </section>

      {/* Popular Anime Carousel */}
      <section className="mt-20 w-full max-w-5xl">
        {animeImages.length > 0 ? (
          <CardCarousel
            images={animeImages.slice(0, 10)}
            autoplayDelay={2000}
          />
        ) : (
          <p className="text-gray-400">Loading popular anime...</p>
        )}
      </section>
    </main>
  );
}
