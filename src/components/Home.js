import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = ({ username, setIsAuthenticated }) => {
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:4000/logout', {}, {
        withCredentials: true,
      });

      if (response.status === 200) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="home">
      <h2>Welcome, {username}!</h2>
      <p>You have successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;


