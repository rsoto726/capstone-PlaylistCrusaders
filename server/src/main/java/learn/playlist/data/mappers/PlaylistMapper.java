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
        playlist.setName(resultSet.getString("name"));;
        playlist.setPublished(resultSet.getBoolean("publish"));
        playlist.setUserId(resultSet.getInt("user_id"));
        playlist.setThumbnailUrl(resultSet.getString("thumbnail_url"));
        playlist.setCreatedAt(resultSet.getTimestamp("date_created").toLocalDateTime());
        playlist.setPublishedAt(resultSet.getTimestamp("date_published").toLocalDateTime());

//        UserMapper userMapper = new UserMapper();
//        playlist.setUser(userMapper.mapRow(resultSet, i));

        return playlist;
    }
}
