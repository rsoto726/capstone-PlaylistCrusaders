package learn.playlist.data;

import learn.playlist.data.mappers.PlaylistMapper;
import learn.playlist.data.mappers.PlaylistSongMapper;
import learn.playlist.models.Playlist;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
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

    @Override
    public List<Playlist> findByUserIdPublic(int userId) {
        final String sql = "select playlist_id, name, publish, date_created, date_published, thumbnail_url, user_id " +
                "from playlist " +
                "where publish = 1 " +
                "and where user_id = ?;";
        return jdbcTemplate.query(sql, new PlaylistMapper(), userId);
    }

    @Override
    public List<Playlist> findByLikes(int userId) {
        final String sql = "select p.playlist_id, p.name, p.publish, p.date_created, p.date_published, p.thumbnail_url, p.user_id " +
                "from playlist p " +
                "inner join `like` l ON p.playlist_id = l.playlist_id " +
                "where l.user_id = ?;";

        return jdbcTemplate.query(sql, new PlaylistMapper(), userId);
    }

    @Override
    public List<Playlist> findByName(String name){
        final String sql = "select playlist_id, name, publish, date_created, date_published, thumbnail_url, user_id " +
                "from playlist " +
                "where publish = 1 " +
                "and name like CONCAT('%', ?, '%');";

        return jdbcTemplate.query(sql, new PlaylistMapper(), name);
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

    @Override
    public Playlist add(Playlist playlist) {
        final String sql = "insert into playlist (name, date_created, thumbnail_url, user_id) values (?,?,?,?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, playlist.getName());
            ps.setTimestamp(2, Timestamp.valueOf(playlist.getCreatedAt()));
            ps.setString(3, playlist.getThumbnailUrl());
            ps.setInt(4, playlist.getUserId());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        playlist.setPlaylistId(keyHolder.getKey().intValue());

        return playlist;
    }

    @Transactional
    @Override
    public boolean deleteById(int playlistId) {
        jdbcTemplate.update("delete from `like` where playlist_id = ?;", playlistId);
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
