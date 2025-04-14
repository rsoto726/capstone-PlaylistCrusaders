package learn.playlist.data.mappers;

import learn.playlist.models.Likes;
import learn.playlist.models.Playlist;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class PlaylistMapper implements RowMapper<Playlist> {
    @Override
    public Playlist mapRow(ResultSet resultSet, int i) throws SQLException {
        Playlist playlist = new Playlist();
        playlist.setPlaylistId(resultSet.getInt("playlist_id"));
        playlist.setDescription(resultSet.getString("description"));
        playlist.setName(resultSet.getString("name"));
        playlist.setPublished(resultSet.getBoolean("published"));
        playlist.setUserId(resultSet.getInt("user_id"));
        playlist.setCreatedAt(resultSet.getTimestamp("created_at").toLocalDateTime());
        playlist.setPublishedAt(resultSet.getTimestamp("publish_at").toLocalDateTime());

        UserMapper userMapper = new UserMapper();
        playlist.setUser(userMapper.mapRow(resultSet, i));

        return playlist;
    }
}
