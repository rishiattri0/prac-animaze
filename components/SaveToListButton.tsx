"use client";

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  episodes?: number | null;
  status?: string;
};

export default function SaveToListButton({ anime }: { anime: Anime }) {
  const handleSave = () => {
    const stored = localStorage.getItem("myAnimeList");
    const current = stored ? JSON.parse(stored) : [];

    if (current.find((a: Anime) => a.mal_id === anime.mal_id)) {
      alert("Already in your list ✅");
      return;
    }

    localStorage.setItem("myAnimeList", JSON.stringify([...current, anime]));
    alert("Added to your list 🎉");
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // prevent Link navigation when clicking
        handleSave();
      }}
      className="mt-2 bg-indigo-600 text-white py-1 px-3 rounded-lg hover:bg-indigo-700 transition text-sm"
    >
      ➕ Add to My List
    </button>
  );
}
