import LandingPageContent from "./page2";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

async function getSeasonalAnime() {
  const res = await fetch("https://api.jikan.moe/v4/seasons/now", {
    // 👇 this makes it revalidate every 1 min (ISR)
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch anime");
  }

  const data = await res.json();

  // ✅ Jikan API returns { data: [ ...anime ] }
  return Array.isArray(data?.data) ? data.data : [];
}

export default async function LandingPage() {
  const animeData: Anime[] = await getSeasonalAnime();

  const animeImages = animeData.map((anime) => ({
    src: anime.images.jpg.large_image_url,
    alt: anime.title,
  }));

  return <LandingPageContent animeImages={animeImages} />;
}
