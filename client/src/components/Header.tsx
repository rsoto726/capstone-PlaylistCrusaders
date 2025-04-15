import React from 'react'
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import {useNavigate} from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header-container">
        <h1 onClick={()=>{navigate('/')}}>Header</h1>
        <SearchBar/>
        <Navbar/>
    </div>
  )
}

export default Header