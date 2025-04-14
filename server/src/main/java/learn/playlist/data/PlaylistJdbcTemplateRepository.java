package learn.playlist.data;

import learn.playlist.data.mappers.PlaylistMapper;
import learn.playlist.data.mappers.PlaylistSongMapper;
import learn.playlist.models.Playlist;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class PlaylistJdbcTemplateRepository implements PlaylistRepository {
    private final JdbcTemplate jdbcTemplate;

    public PlaylistJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Playlist> findAllPublic() {
        final String sql = "select playlist_id, name, publish, date_created, date_published, thumbnail_url, user_id " +
                "from playlist " +
                "where publish = 1 " +
                "limit 1000;";
        return jdbcTemplate.query(sql, new PlaylistMapper());
    }

    @Override
    public List<Playlist> findByUserId(int userId) {
        final String sql = "select playlist_id, name, publish, date_created, date_published, thumbnail_url, user_id " +
                "from playlist " +
                "where user_id = ?;";
        return jdbcTemplate.query(sql, new PlaylistMapper(), userId);
    }

    @Transactional
    @Override
    public Playlist findById(int playlistId) {
        final String sql = "select playlist_id, name, publish, date_created, date_published, thumbnail_url, user_id " +
                "from playlist " +
                "where playlist_id = ?;";
        Playlist result = jdbcTemplate.query(sql, new PlaylistMapper(), playlistId).stream()
                .findAny().orElse(null);
        if (result != null) {
            addSongs(result);
        }
        return result;
    }

    @Transactional
    @Override
    public boolean deleteById(int playlistId) {
        jdbcTemplate.update("delete from like where playlist_id = ?;", playlistId);
        jdbcTemplate.update("delete from playlist_song where playlist_id = ?;", playlistId);
        return jdbcTemplate.update("delete from playlist where playlist_id = ?;", playlistId) > 0;

    }

    @Override
    public boolean update(Playlist playlist) {
        final String sql = "update playlist "
            + "set name = ?, publish = ?, thumbnail_url = ?, date_published = ? "
            + "where playlist_id = ?";

        return jdbcTemplate.update(
                sql,
                playlist.getName(),
                playlist.isPublished(),
                playlist.getThumbnailUrl(),
                playlist.getPublishedAt(),
                playlist.getPlaylistId()
        ) > 0;
    }

    private void addSongs(Playlist playlist) {
        final String sql = "select ps.playlist_id, ps.song_id, "
                + " s.url"
                + "from playlist_song ps"
                + "inner join song s on ps.song_id = s.song_id "
                + "where ps.playlist_id = ?;";
        var playlistSongs = jdbcTemplate.query(sql, new PlaylistSongMapper(), playlist.getPlaylistId());
        playlist.setSongs(playlistSongs);
    }
}
