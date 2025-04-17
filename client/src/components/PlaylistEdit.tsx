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
  useEffect(()=>{
    console.log(playlist);
  },[playlist])
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

        //Not your playlist so get out
        if (authRes.userId !== data.userId) {
          navigate("/");
        }
        console.log(data.songs);
        const sortedSongs = [...data.songs]
          .sort((a, b) => a.index - b.index)
          .map(entry => entry.song);
        data.songs = sortedSongs;
        console.log(sortedSongs);
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

  const deleteSong = (index: number, title: string, songId: number) => {
    if (window.confirm(`Are you sure you want to delete song ${title}? This cannot be undone.`)) {

      const init = {
        method: "DELETE"
      };
      fetch(`http://localhost:8080/api/playlist-song?playlistId=${numericPlaylistId}&songId=${songId}`, init)
        .then((response) => {
          if (response.status === 204) {
            const newSongs = playlist.songs.filter((_, i) => i !== index);
            setPlaylist({ ...playlist, songs: newSongs });
          }
        })
    }
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
      //console.log(data);

      const newSong = {
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: data.title,
        videoId: videoId,
        thumbnail: data.thumbnail_url
      };

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
            const updatedSongs = [
              ...playlist.songs,
              data
            ];
            setPlaylist({
              ...playlist,
              songs: updatedSongs,
            });
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

    const playlistSongs = playlist.songs.map((song, index) => ({
      playlistId: playlist.playlistId,
      songId: song.songId,
      index
    }));

    console.log(playlistSongs);

    fetchWithCredentials(`/playlist/${numericPlaylistId}`, {
      method: 'PUT',
      body: JSON.stringify(playlist),
    })
      .catch(console.log);

    fetchWithCredentials(`/playlist-song/replace/${numericPlaylistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistSongs)
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
          </Form.Group>
        </Col>
      </Row>

      <Row className="align-items-center mb-4">
        <Col>
          <Button variant="success" onClick={handleSave}>
            Save Changes
          </Button>
        </Col>
        <Col xs="auto">
          <Form.Check 
            type="checkbox"
            id="publish-checkbox"
            inline
            label="Publish Playlist"
            checked={playlist.published}
            onChange={(e) =>
              setPlaylist({ ...playlist, published: e.target.checked })
            }
            className="ms-2"
          />
        </Col>
      </Row>


      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="mb-0">Songs</h4>
        </Col>
        <Col xs="auto">
          <Button variant="dark" size="lg" onClick={handleAddSong}>
            + Add Song
          </Button>
        </Col>
      </Row>


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
                onClick={() => deleteSong(idx, song.title, song.songId)}
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
