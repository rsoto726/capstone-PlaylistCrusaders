package learn.playlist.data;

import learn.playlist.models.Song;
import org.springframework.transaction.annotation.Transactional;

public interface SongRepository {
    Song findByUrl(String url);

    @Transactional
    Song add(Song song);

    @Transactional
    boolean deleteById(int songId);
}
