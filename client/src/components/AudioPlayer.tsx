import React, { useRef, useState, useEffect } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { SkipBackwardFill, SkipForwardFill, PlayFill, PauseFill } from 'react-bootstrap-icons';
import { v4 as uuidv4 } from 'uuid';

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

  const playerContainerId = `video-player-${uuidv4()}-${playlist.playlistId}`;

  // process video data
  useEffect(() => {
    const metadata = metadataMap[playlist.songs[currentIndex].songId];
    if (metadata && metadata.videoId !== videoId) {
      console.log(`Updating videoId for song: ${playlist.songs[currentIndex].songId} (Index: ${currentIndex})`);
      setVideoId(metadata.videoId);
    }
  }, [currentIndex, playlist.songs, metadataMap, videoId]);

  // stop inactive playlists
  // when track becomes inactive, it stays lit up. clicking on it will make it not play as it's already active, have to press "play" button
  // ? small issue, not too important, maybe fix later
  useEffect(() => {
    if (activePlaylist !== playlist.playlistId && !!isPlayingState) {
      stopVideo();
    }
  }, [activePlaylist, playlist.playlistId]);
  
  // create video player (very scary)
  useEffect(() => {
    // If we already have a player, destroy it before initializing a new one
    if (playerRef.current) {
      playerRef.current.stopVideo?.();
      playerRef.current.destroy?.();
    }
  
    if (videoId) {
      console.log(`Initializing YouTube player for videoId: ${videoId}`);
  
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
              // Start updating the playhead when video is playing
              setInterval(() => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                  const currentTime = playerRef.current.getCurrentTime();
                  setCurrentTime(currentTime);
                }
              }, 100); // Update every 100ms (can be adjusted)
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
  


  // player controls
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
    if (playerRef.current && typeof playerRef.current.stopVideo === 'function') {
      console.log(`Stopping video: ${videoId}`);
      playerRef.current.stopVideo();
      setIsPlayingState(false);
    }
  };

  const nextVideo = () => {
    const nextIndex = (currentIndex + 1) % playlist.songs.length;
    console.log(`Moving to next song - Song ID: ${playlist.songs[nextIndex].songId} (Index: ${nextIndex})`);
    setCurrentIndex(nextIndex);
    setCurrentTime(0); 
  };

  const prevVideo = () => {
    const prevIndex = (currentIndex - 1 + playlist.songs.length) % playlist.songs.length;
    console.log(`Moving to previous song - Song ID: ${playlist.songs[prevIndex].songId} (Index: ${prevIndex})`);
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
    <div className="container mt-5 audio-player-container" onClick={handleInteraction}>
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
            <h5 className="active-track-title">{metadataMap[playlist.songs[currentIndex].songId]?.title || 'No title'}</h5>

         {/* seek bar */}
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="custom-range w-100"
            />

            <div className="d-flex justify-content-between mt-2 mb-3">
              <small>{formatTime(currentTime)}</small>
              <small>{formatTime(duration)}</small>
            </div>

            <div className="d-flex justify-content-between">
              <Button variant="link" onClick={prevVideo}>
                <SkipBackwardFill />
              </Button>
              <Button variant="link" onClick={() => (isPlayingState ? pauseVideo() : playVideo())}>
                {isPlayingState ? <PauseFill size={24} /> : <PlayFill size={24} />}
              </Button>
              <Button variant="link" onClick={nextVideo}>
                <SkipForwardFill />
              </Button>
            </div>
          </div>

          {/*// TODO inline css replace with css file later  */}
          <ListGroup className="mt-3" style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden' }}>
            {playlist.songs.map((song, idx) => {
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

                    <div className="d-flex flex-column justify-content-center w-100" >
                      <div 
                        style={{ 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' ,
                          width: '80%'
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
