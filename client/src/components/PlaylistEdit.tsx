import React, { useState } from 'react';
import { Form, Container, Row, Col, ListGroup, Button, ButtonGroup } from 'react-bootstrap';

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

const samplePlaylist: Playlist = {
  playlistId: 1,
  name: "Chill Vibes",
  thumbnailUrl: "https://i.pinimg.com/736x/27/67/00/27670025c5edfa3f044359ecfaaffbd6.jpg",
  published: false,
  createdAt: "2025-04-01T10:00:00Z",
  publishedAt: null,
  songs: [
    {
      playlistId: 1,
      songId: 101,
      song: { url: "https://example.com/song1.mp3" },
      index: 0,
    },
    {
      playlistId: 1,
      songId: 102,
      song: { url: "https://example.com/song2.mp3" },
      index: 1,
    },
    {
      playlistId: 1,
      songId: 103,
      song: { url: "https://example.com/song3.mp3" },
      index: 2,
    },
  ],
};

const PlaylistEdit = () => {
  const [playlist, setPlaylist] = useState<Playlist>(samplePlaylist);

  const handleThumbnailClick = () => {
    const newUrl = window.prompt("Enter new image URL:", playlist.thumbnailUrl);
    if (newUrl && newUrl.trim() !== '') {
      setPlaylist({ ...playlist, thumbnailUrl: newUrl });
    }
  };

  const moveSong = (index: number, direction: 'up' | 'down') => {
    const newSongs = [...playlist.songs].sort((a, b) => a.index - b.index);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSongs.length) return;

    // Swap indices
    const temp = newSongs[index].index;
    newSongs[index].index = newSongs[targetIndex].index;
    newSongs[targetIndex].index = temp;

    setPlaylist({ ...playlist, songs: newSongs });
  };

  const deleteSong = (index: number) => {
    let newSongs = [...playlist.songs].sort((a, b) => a.index - b.index);
    newSongs.splice(index, 1);

    // Reindex
    newSongs = newSongs.map((song, idx) => ({
      ...song,
      index: idx,
    }));

    setPlaylist({ ...playlist, songs: newSongs });
  };

  const handleSave = () => {
    alert("TODO: save songs, playlist_songs, and playlist");
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
              <Button variant="dark" size="lg" onClick={() => {alert("TODO: add song to editing view")}}>
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
        {playlist.songs
          .sort((a, b) => a.index - b.index)
          .map((songEntry, idx) => (
            <ListGroup.Item key={songEntry.songId} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{idx + 1}.</strong>{' '}
                <a href={songEntry.song.url} target="_blank" rel="noopener noreferrer">
                  {songEntry.song.url}
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
