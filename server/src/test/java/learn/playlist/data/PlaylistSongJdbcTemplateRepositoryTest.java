package learn.playlist.data;

import learn.playlist.models.PlaylistSong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class PlaylistSongJdbcTemplateRepositoryTest {
    @Autowired
    PlaylistSongJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldAdd() {
        PlaylistSong playlistSong = new PlaylistSong();
        playlistSong.setPlaylistId(3);
        playlistSong.setSongId(1);
        playlistSong.setIndex(1);
        assertTrue(repository.add(playlistSong));
    }

    @Test
    void shouldDelete() {
        assertTrue(repository.deleteByKey(1, 1));
    }
}