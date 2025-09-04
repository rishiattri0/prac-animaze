import { notFound } from "next/navigation";
import Image from "next/image";

type MangaDetails = {
  mal_id: number;
  title: string;
  synopsis: string;
  chapters: number | null;
  volumes: number | null;
  status: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
};

type Review = {
  mal_id: number;
  review: string;
  score: number;
  tags: string[];
  user: {
    username: string;
  };
};

// Fetch Manga Details
async function getManga(id: string): Promise<MangaDetails | null> {
  const res = await fetch(`https://api.jikan.moe/v4/manga/${id}`, {
    next: { revalidate: 60 }, // ✅ enables caching
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

// Fetch Manga Reviews
async function getReviews(id: string): Promise<Review[]> {
  const res = await fetch(`https://api.jikan.moe/v4/manga/${id}/reviews`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

// ✅ React Server Component
export default async function MangaDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Run both in parallel
  const [manga, reviews] = await Promise.all([getManga(id), getReviews(id)]);

  if (!manga) return notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f1f] to-indigo-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-[#0d1324]/80 backdrop-blur-md border border-indigo-800/40 rounded-2xl shadow-xl overflow-hidden">
        {/* Title */}
        <div className="p-6 border-b border-indigo-800/40">
          <h1 className="text-4xl font-extrabold text-indigo-200 tracking-wide">
            {manga.title}
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <Image
            src={manga.images.jpg.large_image_url}
            alt={manga.title}
            width={300}
            height={400}
            className="rounded-xl shadow-lg border border-indigo-800/40"
          />

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <p className="bg-indigo-800/30 px-4 py-2 rounded-lg border border-indigo-700/40">
                <span className="font-semibold text-indigo-300">Chapters:</span>{" "}
                {manga.chapters ?? "?"}
              </p>
              <p className="bg-indigo-800/30 px-4 py-2 rounded-lg border border-indigo-700/40">
                <span className="font-semibold text-indigo-300">Volumes:</span>{" "}
                {manga.volumes ?? "?"}
              </p>
              <p className="bg-indigo-800/30 px-4 py-2 rounded-lg border border-indigo-700/40">
                <span className="font-semibold text-indigo-300">Status:</span>{" "}
                {manga.status}
              </p>
            </div>

            {/* Synopsis */}
            <p className="leading-relaxed text-gray-300 text-sm md:text-base">
              {manga.synopsis}
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
      </div>
    </div>
  );
}
