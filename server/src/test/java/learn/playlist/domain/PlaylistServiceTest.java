package learn.playlist.domain;

import learn.playlist.data.PlaylistRepository;
import learn.playlist.models.Playlist;
import learn.playlist.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class PlaylistServiceTest {

    @Autowired
    PlaylistService service;

    @MockBean
    PlaylistRepository repository;

    @Test
    void shouldAddPlaylistWhenValidUser() {
        User user = makeUser(List.of("USER"));
        Playlist arg = makePlaylist();
        arg.setPlaylistId(0);

        Playlist expected = makePlaylist();
        when(repository.add(arg)).thenReturn(expected);

        Playlist result = service.add(arg, user);
        assertEquals(expected, result);
    }

    @Test
    void shouldNotAddWhenUserDisabled() {
        User disabled = makeUser(List.of("DISABLED"));
        Playlist playlist = makePlaylist();

        Playlist result = service.add(playlist, disabled);
        assertNull(result);
        verify(repository, never()).add(any());
    }

    @Test
    void shouldUpdateWhenValidAndUserIsAdmin() {
        User admin = makeUser(List.of("ADMIN"));
        Playlist playlist = makePlaylist();

        when(repository.update(playlist)).thenReturn(true);

        boolean result = service.update(playlist, admin);
        assertTrue(result);
    }

    @Test
    void shouldNotUpdateWhenPlaylistNull() {
        User user = makeUser(List.of("USER"));

        boolean result = service.update(null, user);
        assertFalse(result);
    }

    @Test
    void shouldDeleteWhenAdmin() {
        User admin = makeUser(List.of("ADMIN"));
        when(repository.deleteById(5)).thenReturn(true);

        boolean result = service.deleteById(5, admin);
        assertTrue(result);
    }


    @Test
    void shouldFindAllPublic() {
        List<Playlist> expected = List.of(makePlaylist());
        when(repository.findAllPublic()).thenReturn(expected);

        List<Playlist> actual = service.findAllPublic();
        assertEquals(expected, actual);
    }

    @Test
    void shouldFindByUserId() {
        List<Playlist> expected = List.of(makePlaylist());
        when(repository.findByUserId(1)).thenReturn(expected);

        List<Playlist> actual = service.findByUserId(1);
        assertEquals(expected, actual);
    }

    @Test
    void shouldFindByUserIdPublic() {
        List<Playlist> expected = List.of(makePlaylist());
        when(repository.findByUserIdPublic(1)).thenReturn(expected);

        List<Playlist> actual = service.findByUserIdPublic(1);
        assertEquals(expected, actual);
    }

    @Test
    void shouldFindByLikes() {
        List<Playlist> expected = List.of(makePlaylist());
        when(repository.findByLikes(1)).thenReturn(expected);

        List<Playlist> actual = service.findByLikes(1);
        assertEquals(expected, actual);
    }

    @Test
    void shouldFindById() {
        Playlist expected = makePlaylist();
        when(repository.findById(1)).thenReturn(expected);

        Playlist actual = service.findById(1);
        assertEquals(expected, actual);
    }

    private User makeUser(List<String> roles) {
        User user = new User();
        user.setUserId(1);
        user.setUsername("testUser");
        user.setPassword("Password@123");
        user.setEmail("test@example.com");
        user.setRoles(roles);
        return user;
    }

    private Playlist makePlaylist() {
        Playlist playlist = new Playlist();
        playlist.setPlaylistId(1);
        playlist.setUserId(1);
        playlist.setName("Chill Vibes");
        playlist.setCreatedAt(LocalDateTime.now());
        return playlist;
    }
}
