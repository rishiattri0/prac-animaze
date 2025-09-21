"use client";

import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { useEffect } from "react";

type Character = {
  character: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
  role: string;
};

export default function CharacterCarousel({
  characters,
}: {
  characters: Character[];
}) {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    slides: {
      perView: 4,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 3, spacing: 16 },
      },
      "(max-width: 768px)": {
        slides: { perView: 2, spacing: 12 },
      },
    },
  });

  // auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div ref={sliderRef} className="keen-slider">
      {characters.map((chara) => (
        <div
          key={chara.character.mal_id}
          className="keen-slider__slide flex flex-col items-center bg-indigo-900/30 p-4 rounded-2xl border border-indigo-800/40 shadow-lg"
        >
          <Image
            src={chara.character.images.jpg.image_url}
            alt={chara.character.name}
            width={200}
            height={180}
            className="rounded-xl shadow-md mb-3 object-cover"
          />
          <p className="text-indigo-200 font-semibold text-sm text-center">
            {chara.character.name}
          </p>
          <p className="text-gray-400 text-xs">{chara.role}</p>
        </div>
      ))}
    </div>
  );
}
