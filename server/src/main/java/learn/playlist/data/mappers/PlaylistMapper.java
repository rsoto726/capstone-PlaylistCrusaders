package learn.playlist.data.mappers;

import learn.playlist.models.Likes;
import learn.playlist.models.Playlist;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class PlaylistMapper implements RowMapper<Playlist> {
    @Override
    public Playlist mapRow(ResultSet resultSet, int i) throws SQLException {
        Playlist playlist = new Playlist();
        playlist.setPlaylistId(resultSet.getInt("playlist_id"));
        playlist.setName(resultSet.getString("name"));;
        playlist.setPublished(resultSet.getBoolean("publish"));
        playlist.setUserId(resultSet.getInt("user_id"));
        playlist.setThumbnailUrl(resultSet.getString("thumbnail_url"));
        Timestamp createdTimestamp = resultSet.getTimestamp("date_created");
        Timestamp publishedTimestamp = resultSet.getTimestamp("date_published");

        playlist.setCreatedAt(createdTimestamp != null ? createdTimestamp.toLocalDateTime() : null);
        playlist.setPublishedAt(publishedTimestamp != null ? publishedTimestamp.toLocalDateTime() : null);


//        UserMapper userMapper = new UserMapper();
//        playlist.setUser(userMapper.mapRow(resultSet, i));

        return playlist;
    }
}
