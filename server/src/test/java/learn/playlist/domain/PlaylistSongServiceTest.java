package learn.playlist.domain;

import learn.playlist.data.PlaylistSongRepository;
import learn.playlist.models.PlaylistSong;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class PlaylistSongServiceTest {

    @Autowired
    PlaylistSongService service;

    @MockBean
    PlaylistSongRepository repository;

    @Test
    void shouldAddPlaylistSongWhenValid() {
        PlaylistSong playlistSong = new PlaylistSong(1, 1, 0);
        Result<PlaylistSong> expected = new Result<>();
        expected.setPayload(playlistSong);

        when(repository.add(playlistSong)).thenReturn(true);

        Result<PlaylistSong> actual = service.add(playlistSong);

        assertTrue(actual.isSuccess());
        assertEquals(expected.getPayload(), actual.getPayload());
    }

    @Test
    void shouldNotAddPlaylistSongWhenInvalid() {
        PlaylistSong playlistSong = new PlaylistSong(-1, -1, -1);
        Result<PlaylistSong> result = service.add(playlistSong);

        assertFalse(result.isSuccess());
        assertEquals(3, result.getMessages().size());
    }

    @Test
    void shouldUpdatePlaylistSongWhenValid() {
        PlaylistSong playlistSong = new PlaylistSong(1, 1, 0);
        Result<PlaylistSong> expected = new Result<>();
        expected.setPayload(playlistSong);

        when(repository.update(playlistSong)).thenReturn(true);

        Result<PlaylistSong> actual = service.update(playlistSong);

        assertTrue(actual.isSuccess());
    }

    @Test
    void shouldNotUpdatePlaylistSongWhenSongNotFound() {
        PlaylistSong playlistSong = new PlaylistSong(1, 1, 0);
        Result<PlaylistSong> expected = new Result<>();
        expected.addMessage("Song not found in playlist.", ResultType.NOT_FOUND);

        when(repository.update(playlistSong)).thenReturn(false);

        Result<PlaylistSong> actual = service.update(playlistSong);

        assertFalse(actual.isSuccess());
        assertEquals("Song not found in playlist.", actual.getMessages().get(0));
    }

    @Test
    void shouldNotUpdatePlaylistSongWhenInvalid() {
        PlaylistSong playlistSong = new PlaylistSong(-1, -1, -1);
        Result<PlaylistSong> result = service.update(playlistSong);

        assertFalse(result.isSuccess());
        assertEquals(3, result.getMessages().size());
    }

    @Test
    void shouldDeletePlaylistSong() {
        int playlistId = 1;
        int songId = 1;

        when(repository.deleteByKey(playlistId, songId)).thenReturn(true);

        boolean actual = service.delete(playlistId, songId);

        assertTrue(actual);
    }

    @Test
    void shouldNotDeletePlaylistSongWhenNotFound() {
        int playlistId = 1;
        int songId = 1;

        when(repository.deleteByKey(playlistId, songId)).thenReturn(false);

        boolean actual = service.delete(playlistId, songId);

        assertFalse(actual);
    }

    @Test
    void shouldNotAddPlaylistSongWhenNull() {
        PlaylistSong playlistSong = null;
        Result<PlaylistSong> result = service.add(playlistSong);

        assertFalse(result.isSuccess());
        assertEquals("PlaylistSong cannot be null", result.getMessages().get(0));
    }

    @Test
    void shouldNotAddPlaylistSongWhenInvalidPlaylistId() {
        PlaylistSong playlistSong = new PlaylistSong(-1, 1, 0);
        Result<PlaylistSong> result = service.add(playlistSong);

        assertFalse(result.isSuccess());
        assertEquals("Valid playlistId is required", result.getMessages().get(0));
    }

    @Test
    void shouldNotAddPlaylistSongWhenInvalidSongId() {
        PlaylistSong playlistSong = new PlaylistSong(1, -1, 0);
        Result<PlaylistSong> result = service.add(playlistSong);

        assertFalse(result.isSuccess());
        assertEquals("Valid songId is required", result.getMessages().get(0));
    }

    @Test
    void shouldNotAddPlaylistSongWhenInvalidIndex() {
        PlaylistSong playlistSong = new PlaylistSong(1, 1, -1);
        Result<PlaylistSong> result = service.add(playlistSong);

        assertFalse(result.isSuccess());
        assertEquals("Index cannot be negative", result.getMessages().get(0));
    }
}
