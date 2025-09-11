"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RecommendationItem {
  src: string;
  alt: string;
  code: string;
  link: string;
}

export function RecommendationCarousel({
  items,
  className,
}: {
  items: RecommendationItem[];
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <div className="flex w-full items-center justify-center gap-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="relative cursor-pointer overflow-hidden rounded-3xl"
            initial={{ width: "5rem", height: "20rem" }}
            animate={{
              width: active === index ? "20rem" : "5rem",
              height: "20rem",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onHoverStart={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <AnimatePresence>
              {active === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute flex h-full w-full flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4"
                >
                  <p className="text-white font-medium">{item.alt}</p>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {item.code}
                  </p>
                  <Link
                    href={item.link}
                    target="_blank"
                    className="mt-2 inline-block text-xs text-indigo-300 hover:text-indigo-400"
                  >
                    Read More →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <img
              src={item.src}
              alt={item.alt}
              className="size-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
