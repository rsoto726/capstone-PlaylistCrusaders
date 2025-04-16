import React, {useEffect} from 'react';
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


function App() {  

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
            <Route path="/profile/:username" element={<Profile />} />
            <Route path='/search' element={<Search />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthContextProvider>

      </Router>
    </div>


  );
}

export default App;
