import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
      return null;
    }
  
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="custom-navbar border-bottom shadow-sm">
      <div className="navbar-content d-flex align-items-center justify-content-between px-4 py-3">
        <div className="logo">🎵 MyPlaylist</div>
        <div className="ms-auto">
          <Button variant="outline-primary" className="custom-button" onClick={handleLoginClick}>
            Login / Register
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
