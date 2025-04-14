package learn.playlist.data.mappers;

import learn.playlist.models.PlaylistSong;
import learn.playlist.models.Role;
import learn.playlist.models.RoleName;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class RoleMapper implements RowMapper<Role> {
    @Override
    public Role mapRow(ResultSet resultSet, int i) throws SQLException {
        Role role = new Role();
        role.setRoleId(resultSet.getInt("role_id"));
        role.setRoleName(RoleName.valueOf(resultSet.getString("role_name").toUpperCase()));

        return role;
    }
}
