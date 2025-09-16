"use client";

import { useEffect, useState } from "react";
import { HoverExpand_001 } from "@/components/newscoursal";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import FooterSection from "@/components/footer";

interface NewsItem {
  title: string;
  excerpt: string;
  url: string;
  images: { jpg: { image_url: string } };
}

interface PromoItem {
  entry: {
    mal_id: number;
    title: string;
    url: string;
  };
  trailer: {
    url: string;
    embed_url: string;
    images: { medium_image_url: string };
  };
}

interface MagazineItem {
  mal_id: number;
  name: string;
  url: string;
  count: number; // number of entries in that magazine
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [magazines, setMagazines] = useState<MagazineItem[]>([]);

  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [loadingMagazines, setLoadingMagazines] = useState(true);

  // Fetch anime news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/anime/20/news"); // Naruto example
        const data = await res.json();
        setNews(data.data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  // Fetch promos
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/watch/promos");
        const data = await res.json();
        setPromos(data.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching promos:", error);
      } finally {
        setLoadingPromos(false);
      }
    };
    fetchPromos();
  }, []);

  // Fetch magazines
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/magazines");
        const data = await res.json();
        setMagazines(data.data.slice(0, 12)); // show only top 12 magazines
      } catch (error) {
        console.error("Error fetching magazines:", error);
      } finally {
        setLoadingMagazines(false);
      }
    };
    fetchMagazines();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-indigo-950 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="text-center mt-20 px-4">
        <TypingAnimation>Latest Anime Updates</TypingAnimation>
        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          Stay updated with the newest headlines, episodes, and promos from the
          anime world.
        </p>
      </section>

      {/* News Carousel */}
      <section className="mt-16 w-full max-w-6xl flex justify-center">
        {loadingNews ? (
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

      {/* Promo Videos */}
      <section className="mt-20 w-full max-w-6xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          🔥 Latest Promos
        </h2>

        {loadingPromos ? (
          <p className="text-gray-400 text-center">Loading promos...</p>
        ) : promos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {promos.map((promo) => (
              <div
                key={promo.entry.mal_id}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
              >
                <iframe
                  src={promo.trailer.embed_url}
                  title={promo.entry.title}
                  className="w-full aspect-video"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{promo.entry.title}</h3>
                  <a
                    href={promo.entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline text-sm"
                  >
                    More Info →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No promos available</p>
        )}
      </section>

      {/* Magazines Section */}
      <section className="mt-20 w-full max-w-6xl px-4 pb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">
          📰 Popular Magazines
        </h2>

        {loadingMagazines ? (
          <p className="text-gray-400 text-center">Loading magazines...</p>
        ) : magazines.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {magazines.map((mag) => (
              <a
                key={mag.mal_id}
                href={mag.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 rounded-xl p-4 shadow-md hover:bg-indigo-800 transition"
              >
                <h3 className="text-lg font-semibold">{mag.name}</h3>
                <p className="text-gray-400 text-sm mt-2">
                  {mag.count} entries
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No magazines available</p>
        )}
      </section>
    </main>
  );
}
