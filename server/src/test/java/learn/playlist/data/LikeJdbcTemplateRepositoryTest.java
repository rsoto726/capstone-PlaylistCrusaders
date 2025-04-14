package learn.playlist.data;

import learn.playlist.models.Likes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class LikeJdbcTemplateRepositoryTest {
    @Autowired
    LikeJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void addALike() {
        Likes likes = new Likes();
        likes.setUserId(1);
        likes.setPlaylistId(1);
        assertTrue(repository.add(likes));
    }

    @Test
    void removeALike() {
        assertTrue(repository.deleteByKey(2, 1));
    }
}