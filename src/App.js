import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Gooauth from './components/Gooauth';
import LinkedinLogin from './components/LinkendinLogin';
import Profile from './components/Profile';
import './App.css';

const AuthButtons = ({ setIsAuthenticated, setUsername }) => {
  const location = useLocation();
  const showAuthButtons = location.pathname === '/signup' || location.pathname === '/login';

  return (
    showAuthButtons && (
      <>
        <Gooauth setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
        <LinkedinLogin />
      </>
    )
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/linkedin/get-user', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success && data.user) {
        localStorage.setItem('token', response.headers.get('token') || '');
        setIsAuthenticated(true);
        setUsername(`${data.user.firstName} ${data.user.lastName}`.trim());
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <GoogleOAuthProvider clientId="928939603188-ofv91jabatl58dem7upp1tr2sh9kvvce.apps.googleusercontent.com">
      <Router>
        <div className="app">
          <h1>Authentication App</h1>

          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/home" replace /> : <Signup />
              }
            />
            <Route
              path="/home"
              element={
                isAuthenticated ? (
                  <Home username={username} setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Profile username={username} setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>

          <AuthButtons setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;