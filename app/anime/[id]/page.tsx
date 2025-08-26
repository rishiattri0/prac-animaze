import { notFound } from "next/navigation";
import Image from "next/image";
import { Header2 } from "@/components/header2";

type AnimeDetails = {
  mal_id: number;
  title: string;
  synopsis: string;
  episodes: number | null;
  status: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
};

async function getAnime(id: string): Promise<AnimeDetails | null> {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  if (!res.ok) return null;

  const data = await res.json();
  return data.data || null;
}

export default async function AnimeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 FIX: params is a Promise
}) {
  const { id } = await params; // 👈 Await it before use
  const anime = await getAnime(id);

  if (!anime) return notFound();

  return (
    <div>
      <Header2 />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f1f] to-indigo-900 text-gray-100 p-8">
        <div className="max-w-8xl mx-auto bg-[#0d1324]/80 backdrop-blur-md border border-indigo-800/40 rounded-2xl shadow-xl overflow-hidden">
          {/* Title */}
          <div className="p-6 border-b border-indigo-800/40">
            <h1 className="text-4xl font-extrabold text-indigo-200 tracking-wide">
              {anime.title}
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <Image
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              width={300}
              height={400}
              className="rounded-xl shadow-lg border border-indigo-800/40"
            />

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-6 text-sm">
                <p className="bg-indigo-800/30 px-4 py-2 rounded-lg border border-indigo-700/40">
                  <span className="font-semibold text-indigo-300">
                    Episodes:
                  </span>{" "}
                  {anime.episodes ?? "?"}
                </p>
                <p className="bg-indigo-800/30 px-4 py-2 rounded-lg border border-indigo-700/40">
                  <span className="font-semibold text-indigo-300">Status:</span>{" "}
                  {anime.status}
                </p>
              </div>

              {/* Synopsis */}
              <p className="leading-relaxed text-gray-300 text-sm md:text-base">
                {anime.synopsis}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
