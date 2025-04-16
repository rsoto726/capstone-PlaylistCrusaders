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
};


const PlaylistContainer: React.FC<Props> = ({playlists}) => {
  const [activePlaylist, setActivePlaylist] = useState<number>(0);

  const handlePlaylistClick = (playlistId: number) => {
    console.log(playlistId);
    setActivePlaylist(playlistId);
  };

  return (
    <div>
      <div className="row">
        {playlists.map((playlist) => (
          <div key={playlist.playlistId} className="col-md-3">
            <PlaylistCard playlist={playlist} activePlaylist={activePlaylist} handlePlaylistClick={handlePlaylistClick}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaylistContainer