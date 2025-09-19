import { notFound } from "next/navigation";
import Image from "next/image";
import TrailerPlayer from "@/components/TrailerPlayer";

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
  trailer?: {
    youtube_id?: string;
  };
};

type Review = {
  mal_id: number;
  type: string;
  review: string;
  score: number;
  tags: string[];
  user: {
    username: string;
  };
};

type Character = {
  character: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
  role: string;
  voice_actors?: {
    person: { name: string };
    language: string;
  }[];
};

// ------------------- FETCHERS -------------------
async function getAnime(id: string): Promise<AnimeDetails | null> {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

async function getReviews(id: string): Promise<Review[]> {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getCharacters(id: string): Promise<Character[]> {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

// ------------------- PAGE -------------------
export default async function AnimeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 params is now a Promise
}) {
  const { id } = await params; // 👈 must await params

  const anime = await getAnime(id);
  const reviews = await getReviews(id);
  const characters = await getCharacters(id);

  if (!anime) return notFound();

  return (
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
          {/* Trailer or Poster */}
          {anime.trailer?.youtube_id ? (
            <TrailerPlayer videoId={anime.trailer.youtube_id} />
          ) : (
            <Image
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              width={300}
              height={400}
              className="rounded-xl shadow-lg border border-indigo-800/40"
            />
          )}

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <p className="bg-indigo-800/30 px-4 py-2 rounded-lg border border-indigo-700/40">
                <span className="font-semibold text-indigo-300">Episodes:</span>{" "}
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

        {/* Reviews Section */}
        <div className="p-6 border-t border-indigo-800/40">
          <h2 className="text-2xl font-bold text-indigo-300 mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.mal_id}
                  className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/40"
                >
                  <p className="text-sm text-gray-300 italic mb-2">
                    By{" "}
                    <span className="text-indigo-400">
                      {review.user.username}
                    </span>
                  </p>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {review.review.length > 400
                      ? review.review.slice(0, 400) + "..."
                      : review.review}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>Score: ⭐ {review.score}</span>
                    <span className="italic">{review.tags.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No reviews available.</p>
          )}
        </div>

        {/* Characters Section */}
        <div className="p-6 border-t border-indigo-800/40">
          <h2 className="text-2xl font-bold text-indigo-300 mb-4">
            Characters
          </h2>
          {characters.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {characters.slice(0, 8).map((chara) => (
                <div
                  key={chara.character.mal_id}
                  className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800/40 flex flex-col items-center text-center"
                >
                  <Image
                    src={chara.character.images.jpg.image_url}
                    alt={chara.character.name}
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md mb-2"
                  />
                  <p className="text-indigo-200 font-semibold text-sm">
                    {chara.character.name}
                  </p>
                  <p className="text-gray-400 text-xs">{chara.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No characters available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
