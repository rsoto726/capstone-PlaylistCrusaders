import React, { useEffect } from 'react'
import Navbar from './Navbar';
import { Button, Dropdown  } from 'react-bootstrap';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../auth";
import '../styles/Header.css';

const Header = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.getLoggedIn();
    
  }, []);
  

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCreatePlaylistClick = () => {
    alert("TODO: Create Playlist");
  };

  const handleProfileClick = () => {
    navigate(`/profile/`);
  };

  const handleLogoutClick = () => {
    auth.logoutUser();
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark py-4 px-4 justify-content-between">
        <span onClick={() => { navigate('/') }} className="navbar-brand logo">Playlist Crusaders</span>
        <div className="nav-links mr-4">
          {auth.user ? (
            <>
            <Button
              variant="btn btn-outline-light btn-lg mr-4"
              onClick={handleCreatePlaylistClick}
            >
              Create Playlist
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-user"
                className="rounded-circle user-icon"
                style={{ width: '40px', height: '40px', padding: 0 }}
              >
                <span role="img" aria-label="user">👤</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogoutClick}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
          ) : (
            <Button
              variant="btn btn-outline-light btn-lg mr-4"
              className="custom-button"
              onClick={handleLoginClick}
            >
              Login / Register
            </Button>
          )}
        </div>
      </nav>
      <SearchBar />
    </div>
  )
}

export default Header