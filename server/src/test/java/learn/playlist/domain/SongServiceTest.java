package learn.playlist.domain;

import learn.playlist.data.SongRepository;
import learn.playlist.models.Song;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class SongServiceTest {

    @Autowired
    SongService service;

    @MockBean
    SongRepository repository;

    @Test
    void shouldFindSongByUrl() {
        Song expected = makeSong();
        when(repository.findByUrl("http://song-url.com")).thenReturn(expected);
        Song actual = service.findByUrl("http://song-url.com");
        assertEquals(expected, actual);
    }

    @Test
    void shouldNotAddSongWhenInvalid() {
        Song song = new Song();
        song.setUrl(null);
        Result<Song> result = service.add(song);
        assertEquals(ResultType.INVALID, result.getType());

        song.setUrl("");
        result = service.add(song);
        assertEquals(ResultType.INVALID, result.getType());
    }

    @Test
    void shouldAddSongWhenValid() {
        Song expected = makeSong();
        Song arg = makeSong();
        arg.setSongId(0);

        when(repository.add(arg)).thenReturn(expected);
        Result<Song> result = service.add(arg);
        assertEquals(ResultType.SUCCESS, result.getType());
        assertEquals(expected, result.getPayload());
    }

    @Test
    void shouldDeleteSongById() {
        when(repository.deleteById(1)).thenReturn(true);
        boolean actual = service.delete(1);
        assertTrue(actual);
    }

    @Test
    void shouldNotDeleteSongIfNotFound() {
        when(repository.deleteById(999)).thenReturn(false);
        boolean actual = service.delete(999);
        assertFalse(actual);
    }

    Song makeSong() {
        Song song = new Song();
        song.setSongId(1);
        song.setUrl("http://song-url.com");
        return song;
    }
}
