import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/App.css';
import Header from './components/Header';
import Home from './components/Home';
import NotFound from './components/NotFound';
import HomePage from './HomePage';
import Login from './Login';
import Register from './Register';
import Navbar from './Navbar';
import SearchBar from './SearchBar';

function App() {
  return (
    <Router>
          <Navbar />
          <SearchBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    
  );
}

export default App;
