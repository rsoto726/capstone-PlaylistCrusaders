import React, { useEffect, useState, useRef } from "react";
import { Button, ListGroup, ProgressBar } from "react-bootstrap";
import { SkipBackwardFill, SkipForwardFill, PlayFill, PauseFill } from "react-bootstrap-icons";

// Extract YouTube Video ID from the URL
const extractVideoId = (url: string): string | null => {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|v\/|e(?:mbed)?\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

interface VideoMetadata {
  title: string;
  thumbnail: string;
}

const AudioPlayer: React.FC = () => {
  const playerRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState<string>("");
  const [videos, setVideos] = useState<string[]>([]);
  const [playerLoaded, setPlayerLoaded] = useState<boolean>(false);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    title: "",
    thumbnail: "",
  });
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (videos.length === 0) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);

    const ids = videos
      .map(extractVideoId)
      .filter((id): id is string => id !== null);
    setVideoIds(ids);
    
    window.onYouTubeIframeAPIReady = () => {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player("video-player", {
          height: "390",
          width: "640",
          videoId: ids[currentIndex],
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [videos, currentIndex]);

  const onPlayerReady = () => {
    setPlayerLoaded(true);

    if (playerRef.current) {
      const videoId = playerRef.current.getVideoData().video_id;
      const title = playerRef.current.getVideoData().title;
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      setThumbnails((prev) => [...prev, thumbnailUrl]);
      setVideoMetadata({
        title: title || "Unknown Title",
        thumbnail: thumbnailUrl,
      });

      playerRef.current.loadVideoById(videoIds[currentIndex]);

      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getDuration) {
          const currentTime = playerRef.current.getCurrentTime();
          setCurrentTime(currentTime);
          setDuration(playerRef.current.getDuration());
        }
      }, 1000);
    }
  };

  const onPlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      nextVideo();
    }
  };

  const playVideo = () => {
    if (playerRef.current) playerRef.current.playVideo();
  };

  const pauseVideo = () => {
    if (playerRef.current) playerRef.current.pauseVideo();
  };

  const stopVideo = () => {
    if (playerRef.current) playerRef.current.stopVideo();
  };

  const nextVideo = () => {
    const nextIndex = (currentIndex + 1) % videoIds.length;
    setCurrentIndex(nextIndex);
    if (playerRef.current) {
      const nextId = videoIds[nextIndex];
      playerRef.current.loadVideoById(nextId);
      const thumbnailUrl = `https://img.youtube.com/vi/${nextId}/maxresdefault.jpg`;
      setVideoMetadata({
        title: playerRef.current.getVideoData().title || "Unknown Title",
        thumbnail: thumbnailUrl,
      });
    }
  };

  const prevVideo = () => {
    const prevIndex = (currentIndex - 1 + videoIds.length) % videoIds.length;
    setCurrentIndex(prevIndex);
    if (playerRef.current) {
      const prevId = videoIds[prevIndex];
      playerRef.current.loadVideoById(prevId);
      const thumbnailUrl = `https://img.youtube.com/vi/${prevId}/maxresdefault.jpg`;
      setVideoMetadata({
        title: playerRef.current.getVideoData().title || "Unknown Title",
        thumbnail: thumbnailUrl,
      });
    }
  };

  const addVideoUrl = () => {
    const videoId = extractVideoId(newVideoUrl);
    if (videoId) {
      setVideos((prev) => [...prev, newVideoUrl]);
      setNewVideoUrl("");
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  

  return (
    <div className="container mt-5 audio-player-container">
      <div id="video-player" style={{ width: 0, height: 0, visibility: "hidden", position: "absolute" }} />

      <div className="active-track-container">
        <h5>{videoMetadata.title || "No title"}</h5>
        <p className="text-muted">YouTube Track {currentIndex + 1}</p>

        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="form-range w-100"
        />

        <div className="d-flex justify-content-between mt-2 mb-3">
          <small>{formatTime(currentTime)}</small>
          <small>{formatTime(duration)}</small>
        </div>

        <div className="d-flex justify-content-between">
          <Button variant="link" onClick={prevVideo}>
            <SkipBackwardFill />
          </Button>
          <Button variant="link" onClick={() => (playerRef.current?.getPlayerState() === 1 ? pauseVideo() : playVideo())}>
            {playerRef.current?.getPlayerState() === 1 ? <PauseFill size={24} /> : <PlayFill size={24} />}
          </Button>
          <Button variant="link" onClick={nextVideo}>
            <SkipForwardFill />
          </Button>
        </div>
      </div>

      <ListGroup className="mt-3">
        {videoIds.map((id, idx) => (
          <ListGroup.Item
            key={id}
            action
            active={idx === currentIndex}
            onClick={() => {
              setCurrentIndex(idx);
              setCurrentTime(0);
            }}
            className={idx === currentIndex ? "active-track-item" : "track-item"}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div>{`Track ${idx + 1}`}</div>
                <small className="text-muted">{id}</small>
              </div>
              <small>{formatTime(duration)}</small>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>

  );
};

export default AudioPlayer;
