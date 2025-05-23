package learn.playlist.data;

import learn.playlist.data.mappers.RoleMapper;
import learn.playlist.data.mappers.UserMapper;
import learn.playlist.models.Role;
import learn.playlist.models.RoleName;
import learn.playlist.models.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class UserJdbcTemplateRepository implements UserRepository {
    private final JdbcTemplate jdbcTemplate;

    public UserJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<User> findAll() {
        final String sql = "select user_id, username, email, password from user;";

        List<User> users = jdbcTemplate.query(sql, new UserMapper());

        for (User user : users) {
            user.setRoles(getRolesByUserId(user.getUserId()));
        }

        return users;
    }

    @Override
    public RoleName findUserRole(int userId){
        final String sql = "select r.name " +
                "from user_role ur " +
                "inner join role r on ur.role_id = r.role_id " +
                "where ur.user_id = ?";

        Role role = jdbcTemplate.query(sql, new RoleMapper(), userId)
                .stream()
                .findFirst()
                .orElse(null);

        return role != null ? role.getRoleName() : null;
    }

    @Transactional
    @Override
    public User findByUsername(String username) {

        final String sql = "select user_id, username, email, password "
                + "from user "
                + "where username = ?;";

        User result = jdbcTemplate.query(sql, new UserMapper(), username).stream()
                .findFirst().orElse(null);

        if (result != null) {
            result.setRoles(getRolesByUserId(result.getUserId()));
        }

        return result;
    }

    @Transactional
    @Override
    public User findByEmail(String email) {

        final String sql = "select user_id, username, email, password "
                + "from user "
                + "where email = ?;";

        User result = jdbcTemplate.query(sql, new UserMapper(), email).stream()
                .findFirst().orElse(null);

        if (result != null) {
            result.setRoles(getRolesByUserId(result.getUserId()));
        }

        return result;
    }

    @Transactional
    @Override
    public User findById(int userId) {

        final String sql = "select user_id, username, email, password "
                + "from user "
                + "where user_id = ?;";

        User result = jdbcTemplate.query(sql, new UserMapper(), userId).stream()
                .findFirst().orElse(null);

        if (result != null) {
            result.setRoles(getRolesByUserId(result.getUserId()));
        }

        return result;
    }

    @Transactional
    @Override
    public User add(User user) {

        final String sql = "insert into user (username, email, password) values (?, ?, ?);";

        GeneratedKeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        user.setUserId(keyHolder.getKey().intValue());

        updateRoles(user);

        return user;
    }

    @Transactional
    @Override
    public boolean update(User user) {

        final String sql = "update user set "
                + "username = ?, "
                + "email = ?, "
                + "password = ? "
                + "where user_id = ?";

        int rowsAffected = jdbcTemplate.update(sql,
                user.getUsername(), user.getEmail(), user.getPassword(), user.getUserId());

        updateRoles(user);
        return rowsAffected > 0;
    }

    @Transactional
    @Override
    public boolean deleteById(int userId) {
        List<Integer> playlistIds = jdbcTemplate.queryForList(
                "select playlist_id from playlist where user_id = ?;",
                Integer.class,
                userId
        );

        // Delete playlist_song entries for each playlist
        for (int playlistId : playlistIds) {
            jdbcTemplate.update("delete from playlist_song where playlist_id = ?;", playlistId);
        }

        // Delete likes for this user's playlists (optional but good practice)
        for (int playlistId : playlistIds) {
            jdbcTemplate.update("delete from `like` where playlist_id = ?;", playlistId);
        }

        // Delete user's likes
        jdbcTemplate.update("delete from `like` where user_id = ?;", userId);

        // Delete user roles
        jdbcTemplate.update("delete from user_role where user_id = ?;", userId);

        // Delete user's playlists
        jdbcTemplate.update("delete from playlist where user_id = ?;", userId);

        // Delete user
        return jdbcTemplate.update("delete from `user` where user_id = ?;", userId) > 0;
    }

    private void updateRoles(User user) {

        jdbcTemplate.update("delete from user_role where user_id = ?;", user.getUserId());

        if (user.getRoles() == null) {
            return;
        }

        for (String roleName : user.getRoles()) {

            String sql = "insert into user_role (user_id, role_id) "
                    + "select ?, role_id from role where `name` = ?;";

            jdbcTemplate.update(sql, user.getUserId(), roleName);
        }
    }

    private List<String> getRolesByUserId(int userId) {
        final String sql = "select r.name "
                + "from user_role ur "
                + "inner join role r on ur.role_id = r.role_id "
                + "where ur.user_id = ?";

        return jdbcTemplate.query(sql, (rs, rowId) -> rs.getString("name"), userId);
    }
}
