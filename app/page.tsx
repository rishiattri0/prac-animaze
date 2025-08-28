import Button from "@/components/button";
import TopAiringCarousel from "@/components/TopAiringCarousel";
import Link from "next/link";

async function getTopAnime() {
  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/top/anime?filter=bypopularity"
    );
    const data = await res.json();
    return data.data.map((anime: any) => ({
      title: anime.title,
      image_url: anime.images.jpg.large_image_url,
    }));
  } catch (err) {
    console.error("Failed to fetch anime:", err);
    return [];
  }
}

export default async function HomePage() {
  const animes = await getTopAnime();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0f172a] to-[#1e1b4b] text-white">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-10">
        <h1 className="text-5xl font-extrabold">
          Seasonal <span className="text-indigo-400">Anime</span> Tracker
        </h1>
        <p className="text-gray-300 mt-4">
          Stay updated with the latest anime releases and never miss an episode
          this season.
        </p>
        <Link href="/signin">
          <Button />
        </Link>
      </section>

      {/* Top Airing Carousel */}
      <section className="max-w-6xl mx-auto px-6">
        <TopAiringCarousel animes={animes} />
      </section>
    </main>
  );
}
