package learn.playlist.data.mappers;

import learn.playlist.models.PlaylistSong;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class PlaylistSongMapper implements RowMapper<PlaylistSong> {
    @Override
    public PlaylistSong mapRow(ResultSet resultSet, int i) throws SQLException {
        PlaylistSong playlistSong = new PlaylistSong();
        playlistSong.setPlaylistId(resultSet.getInt("playlist_id"));
        playlistSong.setSongId(resultSet.getInt("song_id"));

        PlaylistMapper playlistMapper = new PlaylistMapper();
        playlistSong.setPlaylist(playlistMapper.mapRow(resultSet, i));

        SongMapper songMapper = new SongMapper();
        playlistSong.setSong(songMapper.mapRow(resultSet, i));

        return playlistSong;
    }
}
