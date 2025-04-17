package learn.playlist.data;

import learn.playlist.models.Song;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class SongJdbcTemplateRepositoryTest {
    @Autowired
    SongJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindByUrl() {
        Song song = repository.findByUrl("https://soundcloud.com/example-song1");
        assertNotNull(song);
        assertTrue(song.getSongId() > 0);
    }

    @Test
    void shouldCreateSong() {
        Song song = new Song();
        song.setUrl("https://soundcloud.com/example-song3");
        song.setTitle("New Title");
        song.setVideoId("aOIW1ks");
        song.setThumbnail("/image3.jpg");
        assertTrue(repository.add(song).getSongId() > 0);
    }

    @Test
    void shouldDeleteSong() {
        assertTrue(repository.deleteById(2));
    }
}