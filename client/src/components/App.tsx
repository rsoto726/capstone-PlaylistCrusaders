import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from '../auth';
import '../styles/App.css';
import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import Login from './Login';
import Register from './Register';
import PlaylistFullView from './PlaylistFullView';
import ForgotPassword from './ForgotPassword';
import Search from './Search';
import Profile from './Profile';
import ResetPassword from './ResetPassword';
import PlaylistEdit from './PlaylistEdit';
import AdminUserManagement from './AdminUserManagement';
import { Moon, Sun } from 'react-bootstrap-icons';

function App() {  
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setDarkMode(storedTheme === 'dark');
  }, []);

  const toggleLightMode = () => {
    setDarkMode(prevState => {
      const newMode = !prevState;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className="app">
      <Router>
        <AuthContextProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/playlist/:id" element={<PlaylistFullView />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/admin" element={<AdminUserManagement />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path='/search' element={<Search />} />
            <Route path='/edit/:playlistId' element = {<PlaylistEdit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthContextProvider>
      </Router>

      <button className="theme-toggle-button" onClick={toggleLightMode}>
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
}

export default App;
