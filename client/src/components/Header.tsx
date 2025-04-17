import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../auth";
import SearchBar from './SearchBar';
import '../styles/Header.css';

const Header = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

    if(!window.confirm("Create a playlist?")){
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
      if (location.pathname === '/profile') {
        window.location.reload();
      } else {
        navigate('/profile');
      }
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

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  // if click anywhere besides dropdown, closer dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest('.user-dropdown')) {
        closeDropdown();
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  return (
    <div>
      <nav className="navbar navbar-dark py-4 px-4 justify-content-between" style={{backgroundColor:"#8673A1"}}>
        <span onClick={() => { navigate('/') }} className="navbar-brand logo">Playlist Crusaders</span>
        <div className="nav-links mr-4">
          {auth.user ? (
            <>
              <button
                className="btn btn-outline-light btn-lg mr-4"
                onClick={handleCreatePlaylistClick}
              >
                Create Playlist
              </button>

              <div className="user-dropdown" style={{ position: 'relative' }}>
                <button
                  className="user-icon"
                  onClick={toggleDropdown}
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    borderRadius: '50%',
                    backgroundColor: 'lightgray',
                  }}
                >
                  <span role="img" aria-label="user">👤</span>
                </button>

                {dropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <button className="dropdown-item" onClick={handleProfileClick}>Profile</button>
                    {auth.user?.roles?.includes('ADMIN') && (
                      <button className="dropdown-item" onClick={() => navigate('/admin/')}>Admin Panel</button>
                    )}
                    <button className="dropdown-item" onClick={handleLogoutClick}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              className="btn btn-outline-light btn-lg mr-4 custom-button"
              onClick={handleLoginClick}
            >
              Login / Register
            </button>
          )}
        </div>
      </nav>
      <SearchBar />
    </div>
  );
};

export default Header;
