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

// load api now for audio player (scary)
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

// ? break youtube url into usable parts (useless right now, save for url submitter)
const extractVideoId = (url: string): string | null => {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|v\/|e(?:mbed)?\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

type Song = {
  songId: number;
  url: string;
  title: string;
  videoId: string;
  thumbnail: string;
};

type User = {
  userId: number;
  username: string;
}

type Playlist = {
  playlistId: number;
  userId: number;
  name: string;
  thumbnailUrl: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  songs: Array<{
    playlistId: number;
    songId: number;
    song: Song;
    index: number;
  }>;
};
type Props = {
  playlist: Playlist;
  activePlaylist: number;
  handlePlaylistClick: any;
};

const PlaylistCard: React.FC<Props> = ({ playlist, activePlaylist, handlePlaylistClick }) => {
  const [metadataMap, setMetadataMap] = useState<Record<number, VideoMetadata>>({});
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [playlistUser, setPlaylistUser] = useState<User | null>(null);
  // make sure youtube api is ready, then coalesce metadata
  useEffect(() => {
    const fetchMetadataSequentially = async () => {
      await loadYouTubeAPI();
      await youtubeApiReadyPromise;

      let currentIndex = 0;

      while (currentIndex < playlist.songs.length) {
        const song = playlist.songs[currentIndex];
        const videoId = extractVideoId(song.song.url);

        if (!videoId) {
          console.warn(`No video ID found for song URL: ${song.song.url}`);
          currentIndex++;
          continue;
        }

        await new Promise<void>((resolve) => {
          console.log(song.song.title, song.song.videoId);
          setMetadataMap((prev) => ({
            ...prev,
            [song.songId]: {
              title: song.song.title,
              thumbnail: song.song.thumbnail,
              videoId: song.song.videoId,
            },
          }));
          
          resolve();
        });

        currentIndex++;
      }

      console.log(`All metadata fetched for Playlist ID: ${playlist.playlistId}`);
      setApiLoaded(true);
    };

    fetchMetadataSequentially();
  }, [playlist]);

  useEffect(()=>{
    fetch(`http://localhost:8080/api/user/id/${playlist.userId}`)
      .then(r=>r.json())
      .then((data)=>{
        console.log(data);
        setPlaylistUser(data);
      })
  },[])

  return (
    <div>
      <div className="playlist-card" onClick={handlePlaylistClick}>
      <div className="playlist-row">
        <div className="playlist-col-left">
          <button className="like-button">♡</button>
          <h3 className="playlist-title">{playlist.name}</h3>
          <h4 className="playlist-creator">
            {playlistUser ? `by ${playlistUser.username}` : "Loading creator..."}
          </h4>
        </div>
        <div className="playlist-col-right">
          <img
            className="playlist-image"
            src={playlist.thumbnailUrl}
            alt="Playlist Thumbnail"
          />
        </div>
      </div>

        {playlist.songs.length===0? <div>empty playlist</div>
          :apiLoaded && (
            <AudioPlayer
              key={playlist.playlistId}
              playlist={playlist}
              metadataMap={metadataMap}
              activePlaylist={activePlaylist}
            />
          )
        }

      </div>
    </div>
  );
};

export default PlaylistCard;
