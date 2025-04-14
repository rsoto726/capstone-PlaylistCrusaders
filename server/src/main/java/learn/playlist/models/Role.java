package learn.playlist.models;

import java.util.Objects;

public class Role {
    private int roleId;
    private RoleName roleName;

    public Role(int roleId, RoleName roleName) {
        this.roleId = roleId;
        this.roleName = roleName;
    }

    public Role() {
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public RoleName getRoleName() {
        return roleName;
    }

    public void setRoleName(RoleName roleName) {
        this.roleName = roleName;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleId=" + roleId +
                ", roleName=" + roleName +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Role role = (Role) o;
        return roleId == role.roleId && roleName == role.roleName;
    }

    @Override
    public int hashCode() {
        return Objects.hash(roleId, roleName);
    }
}
