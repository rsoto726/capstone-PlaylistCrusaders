// PlaylistCard.tsx
import React from 'react';

interface PlaylistCardProps {
  title: string;
  songs: string[];
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, songs }) => {
  return (
    <div className="playlist-card">
      <div className="playlist-image" />
      <div className="playlist-title">{title}</div>
      <ul className="song-list">
        {songs.slice(0, 3).map((song, index) => (
          <li key={index}>{song}</li>
        ))}
        {songs.length > 3 && <li>...</li>}
      </ul>
    </div>
  );
};

export default PlaylistCard;
