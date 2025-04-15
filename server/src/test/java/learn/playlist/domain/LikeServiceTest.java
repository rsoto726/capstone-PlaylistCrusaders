package learn.playlist.domain;

import learn.playlist.data.LikeRepository;
import learn.playlist.models.Likes;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class LikeServiceTest {

    @Autowired
    LikeService service;

    @MockBean
    LikeRepository repository;

    @Test
    void shouldCountLikesForPlaylist() {
        int playlistId = 1;
        int expectedCount = 5;
        when(repository.countLikesForPlaylist(playlistId)).thenReturn(expectedCount);

        int actualCount = service.countLikesForPlaylist(playlistId);

        assertEquals(expectedCount, actualCount);
    }

    @Test
    void shouldFindLikedPlaylistsFromUser() {
        int userId = 1;
        List<Integer> expectedPlaylistIds = Arrays.asList(1, 2, 3);
        when(repository.findLikedPlaylistIdsByUser(userId)).thenReturn(expectedPlaylistIds);

        List<Integer> actualPlaylistIds = service.findLikedPlaylistFromUser(userId);

        assertEquals(expectedPlaylistIds, actualPlaylistIds);
    }

    @Test
    void shouldAddLike() {
        Likes like = new Likes(1, 1, 1);
        when(repository.add(like)).thenReturn(true);

        boolean success = service.addLike(like);

        assertTrue(success);
    }

    @Test
    void shouldRemoveLike() {
        int userId = 1;
        int playlistId = 1;
        when(repository.deleteByKey(userId, playlistId)).thenReturn(true);

        boolean success = service.removeLike(userId, playlistId);

        assertTrue(success);
    }
}
