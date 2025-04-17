import React, {useState, useEffect} from 'react';
import PlaylistContainer from './PlaylistContainer';
import '../styles/HomePage.css';

const url = "http://localhost:8080";

type Song = {
  songId: number;
  url: string;
  title: string;
  videoId: string;
  thumbnail: string;
};

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

// Home, display all public playlists
const Home: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortedPlaylists, setSortedPlaylists] = useState<Playlist[]>([]);
  const [activePlaylist, setActivePlaylist] = useState<number>(0);

  useEffect(() => {
    fetch(`${url}/api/playlist/public`)
      .then(r => {
        if (!r.ok) throw new Error("Failed to fetch playlists.");
        return r.json();
      })
      .then(async data => {
        setPlaylists(data);
  
        const playlistsWithLikes = await Promise.all(
          data.map(async (playlist: Playlist) => {
            try {
              const res = await fetch(`${url}/api/like/count/${playlist.playlistId}`);
              const likeCount = await res.json();
              return { ...playlist, likeCount };
            } catch (err) {
              console.error(`Error fetching like count for playlist ${playlist.playlistId}`, err);
              return { ...playlist, likeCount: 0 };
            }
          })
        );
  
        const sorted = [...playlistsWithLikes].sort((a, b) => b.likeCount - a.likeCount);
        console.log(sorted);
        setSortedPlaylists(sorted);
  
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Something went wrong.");
      });
  }, []);
  



  if (loading) return (
    <div style={{
      marginTop: '10%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <span className="loader"></span>
      <p>Loading...</p>
    </div>
  );
  
  if (error) return <div>{error}</div>

  return (
    <div className="container mt-3 home-container">
      <h1>Published Playlists</h1>
      <div className="row">
        <PlaylistContainer playlists={playlists} isOwnProfile={false} activePlaylist={activePlaylist} setActivePlaylist={setActivePlaylist}/>
      </div>
      <h1 style={{marginTop:"2rem"}}>Most Liked Playlists</h1>
      <div className="row">
        <PlaylistContainer playlists={sortedPlaylists} isOwnProfile={false} activePlaylist={activePlaylist} setActivePlaylist={setActivePlaylist}/>
      </div>
    </div>
  );
};

export default Home;
