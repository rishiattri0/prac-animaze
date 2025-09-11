"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HoverExpand_001 } from "@/components/newscoursal";

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
  const { id } = useParams(); // get animeId from URL
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchNews = async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/news`);
        const data = await res.json();
        setNews(data.data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-center">Loading news...</p>;
  }

  if (!news.length) {
    return <p className="p-6 text-center">No news available.</p>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <HoverExpand_001
        items={news.map((n) => ({
          src: n.images.jpg.image_url,
          alt: n.title,
          code: n.excerpt,
          link: n.url,
        }))}
      />
    </div>
  );
}
