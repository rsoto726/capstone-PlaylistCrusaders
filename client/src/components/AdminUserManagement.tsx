import React, { useEffect, useState } from 'react';
import { fetchWithCredentials } from '../auth/auth-req-api';

interface User {
  userId: number;
  username: string;
  email: string;
  roles: string[];
}

const AdminUserManagement: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await fetchWithCredentials('/user/loggedin');
        setLoggedInUser(user);
      } catch (err) {
        console.error('Error fetching logged-in user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!loggedInUser || !loggedInUser.roles.includes('ADMIN')) return;

      try {
        const data: User[] = await fetchWithCredentials('/user');
        const filtered = data.filter(user => user.userId !== loggedInUser.userId);
        setUsers(filtered);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  const toggleUserStatus = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'DISABLED' ? 'USER' : 'DISABLED';

    try {
      await fetchWithCredentials(`/user/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, roles: [newRole] } : user
        )
      );
    } catch (err) {
      console.error(`Error updating user role to ${newRole}:`, err);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      console.log(`Deleting user with ID: ${userId}`);

      const response = await fetchWithCredentials(`/user/${userId}`, {
        method: 'DELETE',
      });

      if (response === null) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.userId !== userId)
        );
        window.location.reload();
      } else {
        console.error('Unexpected response on delete:', response);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!loggedInUser || !loggedInUser.roles.includes('ADMIN')) {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isDisabled = user.roles.includes('DISABLED');

            return (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.roles.join(', ')}</td>
                <td>
                  <button
                    className={`btn btn-sm mr-2 ${isDisabled ? 'btn-success' : 'btn-warning'}`}
                    onClick={() => toggleUserStatus(user.userId, user.roles[0])}
                  >
                    {isDisabled ? 'Enable' : 'Disable'}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user.userId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;
