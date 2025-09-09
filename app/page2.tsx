"use client";

import { useEffect } from "react";
import { CardCarousel } from "@/components/ui/card-carousel";
import Button from "@/components/button";
import Link from "next/link";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import FooterSection from "@/components/footer";

export default function LandingPageContent({
  animeImages,
}: {
  animeImages: { src: string; alt: string }[];
}) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/anime");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-indigo-950 to-indigo-900 text-white">
      {/* Hero Section */}
      <section className="text-center mt-20 px-4">
        <TypingAnimation>Seasonal Anime Tracker</TypingAnimation>

        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
          Stay updated with the latest anime releases, rankings and more.
        </p>

        <Link href="/sign-in">
          <Button />
        </Link>
      </section>

      {/* Popular Anime Carousel */}
      <section className="mt-20 w-full max-w-5xl">
        {animeImages?.length > 0 ? (
          <CardCarousel
            images={animeImages.slice(0, 10)}
            autoplayDelay={2000}
          />
        ) : (
          <p className="text-gray-400">No anime found</p>
        )}
      </section>
    </main>
  );
}
