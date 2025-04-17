package learn.playlist.data;

import learn.playlist.models.PlaylistSong;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Override
    @Transactional
    public boolean replaceAllForPlaylist(int playlistId, List<PlaylistSong> playlistSongs) {
        // Delete existing songs for the playlist
        final String deleteSql = "delete from playlist_song where playlist_id = ?";
        jdbcTemplate.update(deleteSql, playlistId);

        // Insert new list of PlaylistSongs
        final String insertSql = "insert into playlist_song (playlist_id, song_id, `index`) VALUES (?, ?, ?)";

        int rowsAdded = 0;
        for (PlaylistSong ps : playlistSongs) {
            rowsAdded += jdbcTemplate.update(insertSql, ps.getPlaylistId(), ps.getSongId(), ps.getIndex());
        }

        // Return true if all inserts were successful
        return rowsAdded == playlistSongs.size();
    }
}
