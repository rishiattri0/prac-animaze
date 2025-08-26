"use client";
import { useEffect } from "react";

export default function TrailerPlayer({ videoId }: { videoId: string }) {
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        createPlayer();
      } else {
        (window as any).onYouTubeIframeAPIReady = createPlayer;
      }
    };

    const createPlayer = () => {
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

    // Load script only once
    if (!document.querySelector("#youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-iframe-api";
      document.body.appendChild(tag);
    }

    loadYouTubeAPI();
  }, [videoId]);

  return (
    <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg border border-indigo-800/40">
      <div id="yt-player" className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}
