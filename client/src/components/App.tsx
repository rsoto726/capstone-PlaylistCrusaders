import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import '../styles/App.css';
import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <div className="app">
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </div>

    
  );
}

export default App;
