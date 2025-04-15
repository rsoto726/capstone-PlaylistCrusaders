import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Playlist {
  playlistId: number;
  title: string;
  description: string;
  songs: any[];
}

const PlaylistFullView = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/playlist/${id}`);
        //console.log(res);
        if (!res.ok) throw new Error('Failed to fetch playlist');
        const data = await res.json();
        console.log(data)
        setPlaylist(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !playlist) return <p>Error: {error || 'Playlist not found.'}</p>;

  return (
    <div className="playlist-full-view">
      <h2>{playlist.title}</h2>
      <p>{playlist.description}</p>
      <h4>Songs:</h4>
      <ul>
        {playlist.songs.map((song, index) => (
          <li key={index}>{song}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistFullView;