import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// user profile, contain user playlist, user like playlist, maybe some user info, profile pic etc
const Profile = () => {
  const { username } = useParams();

  if (!username) {
    return <div>My Profile: {username}</div>;
  }

  return <div>Viewing profile of {username}</div>;
}

export default Profile