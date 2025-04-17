import React, { useEffect, useState } from "react";
import AudioPlayer from './AudioPlayer';
import { Client } from '@stomp/stompjs';
import { fetchWithCredentials } from '../auth/auth-req-api/index';
import {useNavigate} from 'react-router-dom';

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
  isOwnProfile: boolean;
};

const PlaylistCard: React.FC<Props> = ({ playlist, activePlaylist, setActivePlaylist, isOwnProfile }) => {
  const [metadataMap, setMetadataMap] = useState<Record<number, VideoMetadata>>({});
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [playlistUser, setPlaylistUser] = useState<User | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [roles,setRoles] = useState<string[]| null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // make sure youtube api is ready, then coalesce metadata
  useEffect(() => {
    const fetchMetadataSequentially = async () => {
      await loadYouTubeAPI();
      await youtubeApiReadyPromise;

      let currentIndex = 0;

      while (currentIndex < playlist.songs.length) {

        const song = playlist.songs[currentIndex];
        const videoId = playlist.songs[currentIndex].song.videoId;

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

      // console.log(`All metadata fetched for Playlist ID: ${playlist.playlistId}`);
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
    fetchRole();
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

  const fetchRole = async () => {
        try {
          const data = await fetchWithCredentials(`/user/profile`);
          setRoles(data.roles);
        } catch (err) {
          console.error("Error fetching profile:", err);
        } 
      };
  
  
  const handlePlaylistClick = () => {
    console.log(playlist);
    console.log(playlist.playlistId);
    setActivePlaylist(playlist.playlistId);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };


  const handleEdit = () => {
    setShowDropdown(false);
    navigate(`/edit/${playlist.playlistId}`)
  };

  const handleDelete = () => {
    setShowDropdown(false);
    const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirmDelete) return;

    deletePlaylist();
  };

  const deletePlaylist = async() => {
    try{
      const r = await fetchWithCredentials(`/playlist/${playlist.playlistId}`,{
        method:"DELETE",
        });
    
        if (r==null) {
          alert("Playlist deleted successfully.");
          window.location.reload();
        } else {
          alert("Failed to delete playlist.");
        }
      } catch (err) {
        console.error("Error deleting playlist:", err);
        alert("An error occurred while deleting.");
      }
  }

  const handleUserClick = () => {
    navigate(`/profile/${playlistUser?.username}`)
  }

  return (
    <>
      <div className="playlist-card" onClick={handlePlaylistClick}>
      <div className="playlist-row">
        <div className="playlist-col-left">
          <div className="like-button-container">
            <button className="like-button" onClick={handleLikeButton}>{active?"❤️":"🖤"}</button>
            <p className="like-counter">{likeCount}</p>
          </div>
          <h3 className="playlist-title">{playlist.name}</h3>
          <h4 className="playlist-creator" onClick={handleUserClick}>
            {playlistUser ? `by ${playlistUser.username}` : "Loading creator..."}
          </h4>
        </div>
        <div className="playlist-col-right">
          {(roles?.includes("ADMIN") || isOwnProfile) && (
            <>
              <button className="playlist-dropdown" onClick={toggleDropdown}>⋯</button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </>
          )}
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
    </>
  );
};

export default PlaylistCard;