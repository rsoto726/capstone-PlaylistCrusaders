import React from 'react'
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div>
        <h1 onClick={()=>{navigate('/')}}>Header</h1>
        <Navbar/>
        <SearchBar/>
    </div>
  )
}

export default Header