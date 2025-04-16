import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaylistContainer from './PlaylistContainer';
import { fetchWithCredentials } from '../auth/auth-req-api/index'; // adjust path as needed

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = username 
          ? `/username/${username}` // someone else's profile
          : `/profile`;             // own profile

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
        const [userPlaylistsResponse, likedPlaylistsResponse] = await Promise.all([
          fetch(`${baseUrl}/api/playlist/user/${profile.userId}`).then((r) => r.json()),
          fetch(`${baseUrl}/api/playlist/likes/${profile.userId}`).then((r) => r.json())
        ]);

        console.log(userPlaylists);
        console.log(likedPlaylistsResponse);
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
        <h3>User Playlists</h3>
        {userPlaylists.length ? (
          <PlaylistContainer playlists={userPlaylists} />
        ) : (
          <p>No playlists found.</p>
        )}
      </div>

      <div>
        <h3 className='mt-5'>Liked Playlists</h3>
        {likedPlaylists.length ? (
          <PlaylistContainer playlists={likedPlaylists} />
        ) : (
          <p>No liked playlists found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
