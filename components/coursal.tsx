"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Anime = {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
};

export default function TopAiringCarousel({ animes }: { animes: Anime[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {animes.map((anime) => (
          <div key={anime.mal_id} className="min-w-[70%] md:min-w-[30%] px-2">
            <div className="rounded-xl overflow-hidden shadow-lg border border-indigo-800/40 bg-gradient-to-b from-black/50 to-indigo-900/60">
              <Image
                src={anime.images.jpg.image_url}
                alt={anime.title}
                width={400}
                height={600}
                className="object-cover w-full h-64 md:h-80"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-indigo-200 truncate">
                  {anime.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
