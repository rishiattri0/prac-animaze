export async function getTopAiring() {
  try {
    const res = await fetch(
      "https://api.jikan.moe/v4/top/anime?filter=airing&limit=10",
      {
        next: { revalidate: 60 }, // cache for 1 minute
      }
    );

    if (!res.ok) throw new Error("Failed to fetch top airing anime");

    const data = await res.json();
    return data.data; // array of anime
  } catch (error) {
    console.error(error);
    return [];
  }
}
