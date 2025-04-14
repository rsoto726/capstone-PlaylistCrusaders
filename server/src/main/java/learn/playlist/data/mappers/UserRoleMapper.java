package learn.playlist.data.mappers;

import learn.playlist.models.UserRole;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRoleMapper implements RowMapper<UserRole>  {
    @Override
    public UserRole mapRow(ResultSet resultSet, int i) throws SQLException {
        UserRole userRole = new UserRole();
        userRole.setRoleId(resultSet.getInt("role_id"));
        userRole.setUserId(resultSet.getInt("user_id"));

        UserMapper userMapper = new UserMapper();
        userRole.setUser(userMapper.mapRow(resultSet, i));

        RoleMapper roleMapper = new RoleMapper();
        userRole.setRole(roleMapper.mapRow(resultSet, i));
        return userRole;
    }
}
