package learn.playlist.data;

import learn.playlist.data.mappers.SongMapper;
import learn.playlist.models.Song;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;

@Repository
public class SongJdbcTemplateRepository implements SongRepository {
    private final JdbcTemplate jdbcTemplate;

    public SongJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Song findByUrl(String url) {
        final String sql = "select song_id, url, thumbnail, videoId, title from song where url = ?;";
        Song result = jdbcTemplate.query(sql, new SongMapper(), url).stream()
                .findAny().orElse(null);
        return result;
    }

    @Transactional
    @Override
    public Song add(Song song) {
        //If song exists in db already, just return that one
        Song exists = findByUrl(song.getUrl());
        if (exists != null) {
            return exists;
        }

        final String sql = "insert into song (url) values (?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, song.getUrl());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        song.setSongId(keyHolder.getKey().intValue());

        return song;
    }

    @Transactional
    @Override
    public boolean deleteById(int songId) {
        jdbcTemplate.update("delete from playlist_song where song_id = ?", songId);
        return jdbcTemplate.update("delete from song where song_id = ?", songId) > 0;
    }
}
