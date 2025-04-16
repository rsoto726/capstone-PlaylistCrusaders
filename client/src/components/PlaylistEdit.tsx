import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, ListGroup, Button, ButtonGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { checkSession, fetchWithCredentials } from '../auth/auth-req-api/index';

type Song = {
  songId: number;
  title: string;
  url: string;
  videoId: string;
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

const PlaylistEdit = () => {
  const { auth } = useAuth();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playlistId } = useParams<{ playlistId: string }>();
  const numericPlaylistId = playlistId ? parseInt(playlistId, 10) : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const authRes = await checkSession();

        //Not logged in
        if (!authRes.userId) {
          navigate("/")
        }
        const res = await fetch(`http://localhost:8080/api/playlist/${numericPlaylistId}`);
        if (!res.ok) throw new Error('Failed to fetch playlist');
        const data = await res.json();
        //console.log(data.userId);

        //Not your playlist so get out
        if (authRes.userId !== data.userId) {
          navigate("/");
        }

        const sortedSongs = [...data.songs]
          .sort((a, b) => a.index - b.index)
          .map(entry => entry.song);
        data.songs = sortedSongs;
        //console.log(data);
        setPlaylist(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (numericPlaylistId) {
      fetchPlaylist();
    }
  }, [numericPlaylistId]);

  if (!numericPlaylistId) return <p>Error: Invalid playlist ID</p>;
  if (loading) return <p>Loading...</p>;
  if (error || !playlist) return <p>Error: {error || 'Playlist not found.'}</p>;

  const handleThumbnailClick = () => {
    const newUrl = window.prompt("Enter new image URL:", playlist.thumbnailUrl);
    if (newUrl && newUrl.trim() !== '') {
      setPlaylist({ ...playlist, thumbnailUrl: newUrl });
    }
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    const newSongs = [...playlist.songs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSongs.length) return;

    // Swap songs
    [newSongs[index], newSongs[targetIndex]] = [newSongs[targetIndex], newSongs[index]];

    setPlaylist({ ...playlist, songs: newSongs });
  };

  const deleteSong = (index: number) => {
    const newSongs = playlist.songs.filter((_, i) => i !== index);
    setPlaylist({ ...playlist, songs: newSongs });
  };

  const handleAddSong = async () => {
    const url = window.prompt("Enter YouTube video URL:");

    if (!url) return;

    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:&|$)/);
    if (!videoIdMatch) {
      alert("Invalid YouTube URL.");
      return;
    }

    const videoId = videoIdMatch[1];

    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const res = await fetch(oEmbedUrl);
      const data = await res.json();
      console.log(data);

      const newSong = {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: data.title,
        videoId: videoId,
        thumbnail: data.thumbnail_url
      };

      console.log(newSong);

      const init = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newSong),
      };
      fetch("http://localhost:8080/api/song", init)
        .then((response) => {
          if (response.status === 201 || response.status === 400) {
            return response.json();
          } else {
            return Promise.reject(`Unexpected Status Code: ${response.status}`);
          }
        })
        .then((data) => {
          if (data.songId) {
            console.log(data);
          }
          else {
            alert(data);
          }
        })
        .catch(console.log);

    } catch (err) {
      alert("Failed to fetch video metadata.");
      console.error(err);
    }
  }

  const handleSave = async () => {
    console.log("Saving playlist:", playlist);
    fetchWithCredentials(`/playlist/${numericPlaylistId}`, {
      method: 'PUT',
      body: JSON.stringify(playlist),
    })
      .then((response) => {
        if (!response) { //update returns no content
          navigate('/profile');
        }
      })
      .catch(console.log);
  };

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col xs={12} md="auto" className="mb-3 mb-md-0">
          <div
            className="position-relative"
            style={{ width: '150px', height: '150px', cursor: 'pointer' }}
            onClick={handleThumbnailClick}
            title="Click to change thumbnail"
          >
            <img
              src={playlist.thumbnailUrl}
              alt="Playlist Thumbnail"
              className="img-fluid rounded w-100 h-100"
              style={{ objectFit: 'cover', transition: 'opacity 0.3s' }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            />
          </div>
        </Col>
        <Col>
          <Form.Group as={Row} className="align-items-center">
            <Col>
              <Form.Label className="small fw-normal">Playlist Title</Form.Label>
              <Form.Control
                type="text"
                size="lg"
                value={playlist.name}
                onChange={(e) => setPlaylist({ ...playlist, name: e.target.value })}
              />
            </Col>
            <Col xs="auto" className="pt-4">
              <Button variant="dark" size="lg" onClick={handleAddSong}>
                +
              </Button>
            </Col>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Col>
      </Row>

      <h4 className="mb-3">Songs</h4>
      <ListGroup>
        {playlist.songs.map((song, idx) => (
          <ListGroup.Item key={song.songId} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{idx + 1}.</strong>{' '}
              <a href={song.url} target="_blank" rel="noopener noreferrer">
                {song.title}
              </a>
            </div>
            <ButtonGroup size="lg">
              <Button
                variant="outline-secondary"
                onClick={() => moveSong(idx, 'up')}
                disabled={idx === 0}
              >
                ↑
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => moveSong(idx, 'down')}
                disabled={idx === playlist.songs.length - 1}
              >
                ↓
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => deleteSong(idx)}
              >
                ✕
              </Button>
            </ButtonGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default PlaylistEdit;
