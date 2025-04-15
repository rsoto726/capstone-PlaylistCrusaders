import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import '../styles/App.css';
import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import Login from './Login';
import Register from './Register';
import PlaylistFullView from './PlaylistFullView';
import ForgotPassword from './ForgotPassword';
import Search from './Search';

function App() {
  return (
    <div className="app">
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />}/>
        <Route path="/playlist/:id" element={<PlaylistFullView/>}/>
        <Route path='/search' element={<Search />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </div>

    
  );
}

export default App;
