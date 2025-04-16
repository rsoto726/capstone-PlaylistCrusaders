import React, { useState, useEffect } from 'react';
import PlaylistContainer from './PlaylistContainer';
import '../styles/HomePage.css';

const url = "http://localhost:8080";

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

// Home, display all public playlists
const Home: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<number>(0);

  useEffect(() => {
    fetch(`${url}/api/playlist/public`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch playlists.");
        return r.json();
      })
      .then(data => {
        console.log(data);
        setPlaylists(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Something went wrong.");
        setLoading(false);
      });
  }, []);

  const handlePlaylistClick = (playlistId: number) => {
    setActivePlaylist(playlistId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-3">
      <div className="row">
        {playlists.map((playlist) => (
          <div key={playlist.playlistId} className="col-md-3" onClick={() => handlePlaylistClick(playlist.playlistId)}>
            <PlaylistContainer playlist={playlist} activePlaylist={activePlaylist} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
