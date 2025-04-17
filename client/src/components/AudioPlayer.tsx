import React, { useRef, useState, useEffect } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { SkipBackwardFill, SkipForwardFill, PlayFill, PauseFill } from 'react-bootstrap-icons';
import { v4 as uuidv4 } from 'uuid';

type Song = {
  playlistId: number;
  songId: number;
  song: { url: string };
  index: number;
};
type Playlist = {
  playlistId: number;
  name: string;
  thumbnailUrl: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  songs: Song[];
};

type VideoMetadata = {
  title: string;
  thumbnail: string;
  videoId: string;
};

type Props = {
  playlist: Playlist;
  metadataMap: Record<number, VideoMetadata>;
  activePlaylist: number;
};

const AudioPlayer: React.FC<Props> = ({ playlist, metadataMap, activePlaylist }) => {
  const playerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlayingState, setIsPlayingState] = useState<boolean>(false);
  const [inactive, setInactive] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(50);

  const playerContainerId = `video-player-${uuidv4()}-${playlist.playlistId}`;

  const sortedSongs: Song[] = [...playlist.songs].sort((a, b) => a.index - b.index);

  // Load metadata
  useEffect(() => {
    const metadata = metadataMap[sortedSongs[currentIndex].songId];
    if (metadata && metadata.videoId !== videoId) {
      // console.log(`Updating videoId for song: ${sortedSongs[currentIndex].songId} (Index: ${currentIndex})`);
      setVideoId(metadata.videoId);
    }
  }, [currentIndex, sortedSongs, metadataMap, videoId]);

  // Stop inactive playlists
  useEffect(() => {
    if (activePlaylist !== playlist.playlistId && !!isPlayingState) {
      stopVideo();
    }
  }, [activePlaylist, playlist.playlistId]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);
  

  // Create video player
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.stopVideo?.();
      playerRef.current.destroy?.();
    }

    if (videoId) {
      playerRef.current = new window.YT.Player(playerContainerId, {
        videoId,
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
            setPlayerReady(true);
            if (!inactive) {
              playVideo();
            }
          },
          onStateChange: (event: any) => {
            const playerState = event.data;
            if (playerState === window.YT.PlayerState.PLAYING) {
              setIsPlayingState(true);
              setInterval(() => {
                if (playerRef.current?.getCurrentTime) {
                  setCurrentTime(playerRef.current.getCurrentTime());
                }
              }, 100);
            } else if (playerState === window.YT.PlayerState.PAUSED) {
              setIsPlayingState(false);
            } else if (playerState === window.YT.PlayerState.ENDED) {
              console.log("Video ended — playing next song");
              nextVideo();
            }
          },
        },
      });
    }
  }, [videoId, inactive]);

  // Controls
  const playVideo = () => {
    if (playerRef.current) {
      console.log(`Playing video: ${videoId}`);
      playerRef.current.playVideo();
      setIsPlayingState(true);
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      console.log(`Pausing video: ${videoId}`);
      playerRef.current.pauseVideo();
      setIsPlayingState(false);
    }
  };

  const stopVideo = () => {
    if (playerRef.current?.stopVideo) {
      console.log(`Stopping video: ${videoId}`);
      playerRef.current.stopVideo();
      setIsPlayingState(false);
    }
  };

  const nextVideo = () => {
    const nextIndex = (currentIndex + 1) % sortedSongs.length;
    console.log(`Moving to next song - Song ID: ${sortedSongs[nextIndex].songId} (Index: ${nextIndex})`);
    setCurrentIndex(nextIndex);
    setCurrentTime(0);
  };

  const prevVideo = () => {
    const prevIndex = (currentIndex - 1 + sortedSongs.length) % sortedSongs.length;
    console.log(`Moving to previous song - Song ID: ${sortedSongs[prevIndex].songId} (Index: ${prevIndex})`);
    setCurrentIndex(prevIndex);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (playerRef.current) {
      console.log(`Seeking to new time: ${newTime} seconds`);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleInteraction = () => {
    if (inactive) {
      setInactive(false);
    }
  };

  return (
    <div className="container mt-2 audio-player-container" onClick={handleInteraction}>
      <div
        id={playerContainerId}
        style={{ width: '0', height: '0', visibility: 'hidden', position: 'absolute' }}
      />
      {!playerReady ? (
        <div className="text-center py-5">
          <span className="spinner-border" />
          <p className="mt-2">Loading player...</p>
        </div>
      ) : (
        <>
          <div className="active-track-container">
            <h5 className="active-track-title mt-3">
              {metadataMap[sortedSongs[currentIndex].songId]?.title || 'No title'}
            </h5>

            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="custom-range w-100"
            />

            <div className="d-flex justify-content-between mt-1">
              <small className="audio-player-text">{formatTime(currentTime)}</small>
              <small className="audio-player-text">{formatTime(duration)}</small>
            </div>

            <div className="d-flex justify-content-between">
              <Button className="audio-player-button" variant="link" onClick={prevVideo}>
                <SkipBackwardFill />
              </Button>
              <Button className="audio-player-button" variant="link" onClick={() => (isPlayingState ? pauseVideo() : playVideo())}>
                {isPlayingState ? <PauseFill size={24} /> : <PlayFill size={24} />}
              </Button>
              <Button className="audio-player-button" variant="link" onClick={nextVideo}>
                <SkipForwardFill />
              </Button>
            </div>
            <div className="d-flex align-items-center mt-2">
              <small className="me-2 audio-player-text">🔊</small>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="form-range w-100 volume-slider"
              />
            </div>
          </div>

          <ListGroup className="mt-3" style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' }}>
            {sortedSongs.map((song, idx) => {
              const metadata = metadataMap[song.songId];

              return (
                <ListGroup.Item
                  key={song.songId}
                  action
                  active={idx === currentIndex}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setCurrentTime(0);
                  }}
                  className={idx === currentIndex ? 'active-track-item' : 'track-item'}
                >
                  <div className="d-flex align-items-center w-100">
                    <img
                      className="audio-track-thumbnail"
                      src={metadata.thumbnail}
                      alt="thumb"
                    />
                    <div className="d-flex flex-column justify-content-center w-100">
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '80%',
                        }}
                      >
                        {metadata?.title || `Track ${idx + 1}`}
                      </div>
                      <small className="text-muted">{formatTime(duration)}</small>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;
