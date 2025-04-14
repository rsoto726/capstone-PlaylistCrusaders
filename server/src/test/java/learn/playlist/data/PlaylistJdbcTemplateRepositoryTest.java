package learn.playlist.data;

import learn.playlist.models.Playlist;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class PlaylistJdbcTemplateRepositoryTest {
    @Autowired
    PlaylistJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldFindAllPublic() {
        List<Playlist> result = repository.findAllPublic();
        assertNotNull(result);
    }

    @Test
    void shouldNotFindInvalidUser() {
        List<Playlist> result = repository.findByUserId(999);
        assertTrue(result.isEmpty());
    }

    @Test
    void shouldCreatePlaylist() {
        Playlist playlist = createPlaylist();
        Playlist result = repository.add(playlist);
        assertTrue(result.getPlaylistId() > 0);
    }

    @Test
    void shouldUpdatePlaylist() {
        Playlist playlist = createPlaylist();
        playlist.setPlaylistId(1);
        playlist.setName("New Updated Mix");
        assertTrue(repository.update(playlist));
    }

    @Test
    void shouldDeletePlaylist() {
        assertTrue(repository.deleteById(2));
    }

    private Playlist createPlaylist() {
        Playlist playlist = new Playlist();
        playlist.setName("Untitled");
        playlist.setCreatedAt(LocalDateTime.now());
        playlist.setThumbnailUrl("example.com/img.jpg");
        playlist.setUserId(1);
        return playlist;
    }
}