"use client";
import { useEffect } from "react";

export default function TrailerPlayer({ videoId }: { videoId: string }) {
  useEffect(() => {
    // Load the YouTube IFrame API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1, // 👈 required for autoplay
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
          },
        },
      });
    };
  }, [videoId]);

  return (
    <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg border border-indigo-800/40">
      <div id="yt-player" className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
