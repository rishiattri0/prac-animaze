"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tv, Flame, Star } from "lucide-react";
import { Card, CardContent } from "@/components/card";

type AnimeItem = {
  title: string;
  image_url: string;
};

export default function TopAiringCarousel({ animes }: { animes: AnimeItem[] }) {
  const count = animes?.length ?? 0;
  const [index, setIndex] = useState(0);

  // Auto-slide
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 4000);
    return () => clearInterval(id);
  }, [count]);

  if (!count) return null;

  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  return (
    <section className="px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Poster carousel */}
          <div className="relative w-[280px] md:w-[340px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
            {animes.map((a, i) => (
              <img
                key={`${a.title}-${i}`}
                src={a.image_url}
                alt={a.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Title overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="text-white text-sm font-semibold truncate">
                {animes[index].title}
              </div>
            </div>

            {/* Arrows */}
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 grid place-items-center"
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 grid place-items-center"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {animes.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === index ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Features Section with animation */}
          <div className="flex flex-col gap-6 max-w-md w-full cursor-pointer">
            {/* Track Episodes */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#0f172a] text-white border-none shadow-md rounded-2xl hover:scale-105 transition-transform shadow-cyan-500/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <Tv className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h3 className="font-semibold">Track Episodes</h3>
                    <p className="text-sm text-gray-400">
                      Keep a record of what you’re watching and stay synced
                      across devices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Seasonal Updates */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#0f172a] text-white border-none shadow-md rounded-2xl hover:scale-105 transition-transform shadow-cyan-500/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <div>
                    <h3 className="font-semibold">Seasonal Updates</h3>
                    <p className="text-sm text-gray-400">
                      Always know what’s trending in the anime world each
                      season.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Favorites List */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-[#0f172a] text-white border-none shadow-md rounded-2xl hover:scale-105 transition-transform shadow-cyan-500/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="font-semibold">Favorites List</h3>
                    <p className="text-sm text-gray-400">
                      Save your top anime in a personal watchlist for quick
                      access.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
