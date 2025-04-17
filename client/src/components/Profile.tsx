import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaylistContainer from './PlaylistContainer';
import { fetchWithCredentials } from '../auth/auth-req-api/index';

interface User {
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

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

const baseUrl = "http://localhost:8080";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [likedPlaylists, setLikedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlaylist, setActivePlaylist] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = username 
          ? `/user/username/${username}` // someone else's profile
          : `/user/profile`;            // own profile

        const data = await fetchWithCredentials(url);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } 
    };

    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!profile) return;

      try {
        // Fetching user and liked playlists concurrently
        const url = username ? `${profile.userId}/public` : `${profile.userId}`;
        const [userPlaylistsResponse, likedPlaylistsResponse] = await Promise.all([
          fetch(`${baseUrl}/api/playlist/user/${url}`).then((r) => r.json()),
          fetch(`${baseUrl}/api/playlist/likes/${profile.userId}`).then((r) => r.json())
        ]);

        setUserPlaylists(userPlaylistsResponse);
        setLikedPlaylists(likedPlaylistsResponse);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [profile]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>User not found.</p>;

  return (
    <div className="container mt-3">
      <div className="mb-4">
        <h2>{profile.username}'s Profile</h2>
      </div>

      <div>
        <h3>{!username?"Your ":"User "} Playlists</h3>
        {userPlaylists.length ? (
          <PlaylistContainer playlists={userPlaylists} isOwnProfile={!username} activePlaylist={activePlaylist} setActivePlaylist={setActivePlaylist}/>
        ) : (
          <p>No playlists found.</p>
        )}
      </div>

      <div>
        <h3 className='mt-5'>{!username?"Your ":`${username}'s`}Liked Playlists</h3>
        {likedPlaylists.length ? (
          <PlaylistContainer playlists={likedPlaylists} isOwnProfile={false} activePlaylist={activePlaylist} setActivePlaylist={setActivePlaylist}/>
        ) : (
          <p>No liked playlists found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
