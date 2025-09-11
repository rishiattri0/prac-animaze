"use client";

import { useEffect, useState } from "react";
import { HoverExpand_001 } from "@/components/newscoursal";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import Link from "next/link";
import FooterSection from "@/components/footer";

interface NewsItem {
  title: string;
  excerpt: string;
  url: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Example: Naruto news (id = 20). Replace with any anime ID
        const res = await fetch("https://api.jikan.moe/v4/anime/20/news");
        const data = await res.json();
        setNews(data.data.slice(0, 8)); // take first 8
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-indigo-950 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="text-center mt-20 px-4">
        <TypingAnimation>Latest Anime News</TypingAnimation>

        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          Stay updated with the newest headlines from the anime world.
        </p>
      </section>

      {/* News Carousel */}
      <section className="mt-16 w-full max-w-6xl flex justify-center">
        {loading ? (
          <p className="text-gray-400">Loading news...</p>
        ) : news.length > 0 ? (
          <HoverExpand_001
            items={news.map((n) => ({
              src: n.images.jpg.image_url,
              alt: n.title,
              code: n.excerpt,
              link: n.url,
            }))}
          />
        ) : (
          <p className="text-gray-400">No news available</p>
        )}
      </section>
    </main>
  );
}
