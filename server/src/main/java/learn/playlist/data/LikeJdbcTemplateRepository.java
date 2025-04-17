package learn.playlist.data;

import learn.playlist.models.Likes;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class LikeJdbcTemplateRepository implements LikeRepository {
    private final JdbcTemplate jdbcTemplate;

    public LikeJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    @Override
    public int countLikesForPlaylist(int playlistId) {
        final String sql = "select count(*) from `like` where playlist_id = ?;";
        return jdbcTemplate.queryForObject(sql, Integer.class, playlistId);
    }

    @Override
    public List<Integer> findLikedPlaylistIdsByUser(int userId) {
        final String sql = "select playlist_id from `like` where user_id = ?;";
        return jdbcTemplate.queryForList(sql, Integer.class, userId);
    }

    @Override
    public boolean findUserPlaylist(int userId, int playlistId){
        final String sql = "select * from `like` "+
                "where like.user_id = ? "+
                "and like.playlist_id = ?";
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, userId, playlistId);
        return !results.isEmpty();
    }

    @Override
    public boolean add(Likes likes) {
        final String sql = "insert into `like` (user_id, playlist_id) values (?,?);";
        return jdbcTemplate.update(sql, likes.getUserId(), likes.getPlaylistId()) > 0;
    }

    @Override
    public boolean deleteByKey(int userId, int playlistId) {
        final String sql = "delete from `like` "
                + "where user_id = ? and playlist_id = ?;";

        return jdbcTemplate.update(sql, userId, playlistId) > 0;
    }
}
