package learn.playlist.data.mappers;

import learn.playlist.models.Likes;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class LikesMapper implements RowMapper<Likes> {
    @Override
    public Likes mapRow(ResultSet resultSet, int i) throws SQLException {
        Likes likes = new Likes();
        likes.setLikeId(resultSet.getInt("like_id"));
        likes.setPlaylistId(resultSet.getInt("playlist_id"));
        likes.setUserId(resultSet.getInt("user_id"));

        UserMapper userMapper = new UserMapper();
        likes.setUser(userMapper.mapRow(resultSet, i));

        PlaylistMapper playlistMapper = new PlaylistMapper();
        likes.setPlaylist(playlistMapper.mapRow(resultSet, i));

        return likes;
    }
}
