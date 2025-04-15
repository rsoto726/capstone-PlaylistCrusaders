import React, {useState, useEffect} from 'react'
import UserCard from './UserCard';

type User = {
  userId: number;
  username: string;
  email: string;
  password: string;
};

// fetch all users, map user card
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(()=>{
    fetch(`http://localhost:8080/api/user`)
      .then(r=>r.json())
      .then((data: User[])=>{
        setUsers(data);
      })
  },[])

  return (
    <div>
      {users.map((user)=>{
        return <UserCard key={user.userId} user={user}/>
      })}
    </div>
  )
}

export default UserList