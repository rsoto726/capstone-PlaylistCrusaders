import React, { useEffect, useState } from "react";
import AudioPlayer from './AudioPlayer';

type VideoMetadata = {
  title: string;
  thumbnail: string;
  videoId: string;
};

let youtubeApiReadyResolver: () => void;
const youtubeApiReadyPromise = new Promise<void>((resolve) => {
  youtubeApiReadyResolver = resolve;
});
(window as any).onYouTubeIframeAPIReady = () => {
  youtubeApiReadyResolver();
};

const loadYouTubeAPI = () => {
  return new Promise<void>((resolve, reject) => {
    if ((window as any).YT?.Player) {
      resolve();
    } else if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-iframe-api";
      tag.async = true;
      tag.onload = () => {
        resolve();
      };
      tag.onerror = () => {
        console.error("Failed to load YouTube API");
        reject(new Error("Failed to load YouTube API"));
      };
      document.body.appendChild(tag);
    } else {
      resolve();
    }
  });
};

const extractVideoId = (url: string): string | null => {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|v\/|e(?:mbed)?\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

type Playlist = {
  playlistId: number;
  name: string;
  thumbnailUrl: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  songs: Array<{
    playlistId: number;
    songId: number;
    song: { url: string };
    index: number;
  }>;
};

type Props = {
  playlist: Playlist;
  activePlaylist: number;
};

const PlaylistContainer: React.FC<Props> = ({ playlist, activePlaylist }) => {
  const [metadataMap, setMetadataMap] = useState<Record<number, VideoMetadata>>({});
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchMetadataSequentially = async () => {
      await loadYouTubeAPI();
      await youtubeApiReadyPromise;

      let currentIndex = 0;

      while (currentIndex < playlist.songs.length) {
        const song = playlist.songs[currentIndex];
        const videoId = extractVideoId(song.song.url);

        if (!videoId) {
          console.warn(`⚠️ No video ID found for song URL: ${song.song.url}`);
          currentIndex++;
          continue;
        }

        await new Promise<void>((resolve) => {
          const tempPlayerDiv = document.createElement("div");
          tempPlayerDiv.style.display = "none";
          document.body.appendChild(tempPlayerDiv);

          const player = new (window as any).YT.Player(tempPlayerDiv, {
            height: "0",
            width: "0",
            videoId,
            events: {
              onReady: (event: any) => {
                const data = event.target.getVideoData();
                const title = data.title || "Unknown Title";
                const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                setMetadataMap((prev) => ({
                  ...prev,
                  [song.songId]: { title, thumbnail, videoId },
                }));

                player.destroy();
                document.body.removeChild(tempPlayerDiv);
                resolve();
              },
              onError: () => {
                console.error(`Error loading video metadata for song ${song.songId}`);
                player.destroy();
                document.body.removeChild(tempPlayerDiv);
                resolve();
              },
            },
          });
        });

        currentIndex++;
      }

      console.log(`All metadata fetched for Playlist ID: ${playlist.playlistId}`);
      setApiLoaded(true);
    };

    fetchMetadataSequentially();
  }, [playlist]);


  return (
    <div>
      <div className="playlist-card">
        <img className="playlist-image" src={playlist.thumbnailUrl} alt="Playlist Thumbnail" />
        <div className="playlist-title">{playlist.name}</div>
        {apiLoaded && (
          <AudioPlayer
            key={playlist.playlistId}
            playlist={playlist}
            metadataMap={metadataMap}
            activePlaylist={activePlaylist}
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistContainer;
