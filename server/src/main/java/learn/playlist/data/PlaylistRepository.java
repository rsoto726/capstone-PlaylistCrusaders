package learn.playlist.data;

import learn.playlist.models.Playlist;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PlaylistRepository {
    List<Playlist> findAllPublic();

    List<Playlist> findByUserId(int userId);

    List<Playlist> findByUserIdPublic(int userId);

    List<Playlist> findByLikes(int userId);

    @Transactional
    Playlist findById(int playlistId);

    @Transactional
    boolean deleteById(int playlistId);

    boolean update(Playlist playlist);
}
