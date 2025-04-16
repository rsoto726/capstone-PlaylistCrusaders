import React, { useEffect } from 'react'
import Navbar from './Navbar';
import { Button, Dropdown } from 'react-bootstrap';
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

  const handleCreatePlaylistClick = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("You must be logged in to create a playlist.");
      return;
    }

    const playlistData = {
      name: "New Playlist",
      publish: false,
      createdAt: new Date().toISOString(),
      thumbnailUrl: "https://catpedia.wiki/images/4/4e/Uni.jpg"
    };

    try {
      const response = await fetch('http://localhost:8080/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(playlistData)
      });

      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }

      const data = await response.json();
      console.log("Created playlist:", data);
      alert(`Playlist created: ${data.name}`);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert('An error occurred while creating the playlist.');
    }
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
                  {auth.user?.roles?.includes('ADMIN') && (
                  <Dropdown.Item onClick={() => navigate('/admin/')}>
                    Admin Panel
                  </Dropdown.Item>
                    )}
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