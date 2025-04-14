package learn.playlist.data;

import learn.playlist.models.PlaylistSong;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PlaylistSongJdbcTemplateRepository implements PlaylistSongRepository {
    private final JdbcTemplate jdbcTemplate;

    public PlaylistSongJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public boolean add(PlaylistSong playlistSong) {
        final String sql = "insert into playlist_song (playlist_id, song_id, `index`) values (?,?,?);";
        return jdbcTemplate.update(sql, playlistSong.getPlaylistId(), playlistSong.getSongId(), playlistSong.getIndex()) > 0;
    }

    @Override
    public boolean update(PlaylistSong playlistSong) {
        final String sql = "update playlist_song set "
                + "`index` = ? "
                + "where playlist_id = ? and song_id = ?;";
        return jdbcTemplate.update(sql, playlistSong.getIndex(), playlistSong.getPlaylistId(), playlistSong.getSongId()) > 0;
    }

    @Override
    public boolean deleteByKey(int playlistId, int songId) {
        final String sql = "delete from playlist_song "
                + "where playlist_id = ? and song_id = ?;";

        return jdbcTemplate.update(sql, playlistId, songId) > 0;
    }
}
