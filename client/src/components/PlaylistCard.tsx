import React, { useEffect, useState } from "react";
import AudioPlayer from './AudioPlayer';
import { Client } from '@stomp/stompjs';
import { fetchWithCredentials } from '../auth/auth-req-api/index';
const SockJS = require('sockjs-client');

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
  setActivePlaylist: any;
};

const PlaylistCard: React.FC<Props> = ({ playlist, activePlaylist, setActivePlaylist }) => {
  const [metadataMap, setMetadataMap] = useState<Record<number, VideoMetadata>>({});
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [playlistUser, setPlaylistUser] = useState<User | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);


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
          // console.log(song.song.title, song.song.videoId);
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

  // websocket like listener
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("websocket connected")
        stompClient.subscribe('/topic/likes', (message) => {
          const data = JSON.parse(message.body);
          if (data.playlistId === playlist.playlistId) {
            console.log('Like updated for playlist:', playlist.playlistId);
            getLikeCount();
            fetchLike();
          }
        });
      },
      onStompError: (error) => {
        console.error('Error in WebSocket connection:', error);
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [playlist]);

  // check if playlist is already liked
  useEffect(() => {
    fetchLike();
  }, [playlist.playlistId]); 

  const fetchLike = async () => {
    try {
      const response = await fetchWithCredentials(`/like/find/user/${playlist.playlistId}`);
  
      setActive(response);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  

  // get like count
  useEffect(()=>{
    getLikeCount();
  },[])

  const getLikeCount = () => {
    fetch(`http://localhost:8080/api/like/count/${playlist.playlistId}`)
    .then(r=>r.json())
    .then(data=>{
      setLikeCount(data);
    })
  }

  // get user data (name)
  useEffect(()=>{
    fetch(`http://localhost:8080/api/user/id/${playlist.userId}`)
      .then(r=>r.json())
      .then((data)=>{
        console.log(data);
        setPlaylistUser(data);
      })
  },[])

  const handleLikeButton = () => {
    if(active){
      removeLike();
    }else{
      addLike();
    }
  };

  const removeLike = () => {
    fetchWithCredentials(`/like/${playlist.playlistId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Like removed successfully');
          setActive(false);
        } else {
          console.error('Failed to remove like');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const addLike = () => {
    fetchWithCredentials('/like', {
      method: 'POST',
      body: JSON.stringify({
        playlistId: playlist.playlistId,
      }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Like added successfully');
          setActive(true);
        } else {
          console.error('Failed to add like');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  
  const handlePlaylistClick = () => {
    console.log(playlist);
    console.log(playlist.playlistId);
    setActivePlaylist(playlist.playlistId);
  };

  return (
    <div>
      <div className="playlist-card" onClick={handlePlaylistClick}>
      <div className="playlist-row">
        <div className="playlist-col-left">
          <div className="like-button-container">
            <button className="like-button" onClick={handleLikeButton}>{active?"❤️":"🖤"}</button>
            <p className="like-counter">{likeCount}</p>
          </div>
          <h3 className="playlist-title">{playlist.name}</h3>
          <h4 className="playlist-creator">
            {playlistUser ? `by ${playlistUser.username}` : "Loading creator..."}
          </h4>
        </div>
        <div className="playlist-col-right">
          <button className="playlist-dropdown">...</button>
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
