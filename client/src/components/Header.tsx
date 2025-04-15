import React from 'react'
import Navbar from './Navbar';
import { Button } from 'react-bootstrap';
import SearchBar from './SearchBar';
import {useNavigate} from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div>
        <nav className="navbar navbar-dark bg-dark py-4 px-4 justify-content-between">
          <span onClick={()=>{navigate('/')}} className="navbar-brand logo">Playlist Crusaders</span>
          <div className="nav-links">
          <Button variant="btn btn-primary" className="custom-button" onClick={handleLoginClick}>
            Login / Register
          </Button>
          </div>
          
        </nav>
        <SearchBar/>
    </div>
  )
}

export default Header