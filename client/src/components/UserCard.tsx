import React from 'react';

type User = {
  userId: number;
  username: string;
  email: string;
  password: string;
};

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.username}</h3>
      <p>Email: {user.email}</p>
      <button>Suspend</button>
      <button>Unsuspend</button>
      <button>Delete</button>
    </div>
  );
};

export default UserCard;
