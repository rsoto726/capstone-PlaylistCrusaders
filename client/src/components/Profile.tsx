import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaylistCard from './PlaylistCard';

interface User {
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

interface Playlist {
  playlistId: number;
  title: string;
}


const sampleData = [
  { title: 'Chill Vibes', songs: ['Song one', 'Song two', 'Song three', 'Song four'] },
  { title: 'Workout Mix', songs: ['Track 1', 'Track 2', 'Track 3'] },
  { title: 'Focus Mode', songs: ['Ambient A', 'Ambient B', 'Ambient C'] },
  { title: 'Throwbacks', songs: ['Hit 1', 'Hit 2', 'Hit 3', 'Hit 4'] },
];

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [likedPlaylists, setLikedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndLikes = async () => {
      try {
        const userRes = await fetch(`http://localhost:8080/api/user/id/${userId}`);
        if (!userRes.ok) throw new Error('User not found');
        const userData = await userRes.json();
        setUser(userData);

        const likesRes = await fetch(`http://localhost:8080/api/playlist/likes/${userId}`);
        if (!likesRes.ok) throw new Error('Failed to fetch liked playlists');
        const likedData = await likesRes.json();
        setLikedPlaylists(likedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserAndLikes();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mt-3">
      <div className="mb-4">
        <h2>{user.username}'s Profile</h2>
      </div>
      <div className="row">
        {sampleData.map((playlist, index) => (
          <div key={index} className="col-md-3">
            <PlaylistCard title={playlist.title} songs={playlist.songs} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;