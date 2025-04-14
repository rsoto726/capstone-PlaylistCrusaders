package learn.playlist.data.mappers;

import learn.playlist.models.Role;
import learn.playlist.models.Song;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SongMapper implements RowMapper<Song> {
    @Override
    public Song mapRow(ResultSet resultSet, int i) throws SQLException {
        Song song = new Song();
        song.setSongId(resultSet.getInt("song_id"));
        song.setUrl(resultSet.getString("url"));
        return song;
    }
}
