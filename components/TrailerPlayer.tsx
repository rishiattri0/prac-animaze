"use client";
import { useEffect } from "react";

export default function TrailerPlayer({ videoId }: { videoId: string }) {
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player("yt-player", {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
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
    <div className="w-full md:w-[600px] aspect-video rounded-xl overflow-hidden shadow-lg border border-indigo-800/40">
      <div id="yt-player" />
    </div>
  );
}
