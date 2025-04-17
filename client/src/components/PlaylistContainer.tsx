import React, { useState, useEffect }  from 'react'
import PlaylistCard from './PlaylistCard';

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

type Props = {
  playlists: Playlist[];
  isOwnProfile: boolean;
  activePlaylist:any;
  setActivePlaylist:any;
};


const PlaylistContainer: React.FC<Props> = ({playlists, isOwnProfile, activePlaylist, setActivePlaylist}) => {



  return (
    <div className="playlist-scroll-container">
      <div className="playlist-row-scroll">
        {playlists.map((playlist) => (
          <div key={playlist.playlistId} className="playlist-card-wrapper">
            <PlaylistCard
              playlist={playlist}
              activePlaylist={activePlaylist}
              setActivePlaylist={setActivePlaylist}
              isOwnProfile={isOwnProfile}
            />
          </div>
        ))}
      </div>
    </div>
  )
  
}

export default PlaylistContainer