import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ username: propUsername, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(propUsername); // Fallback for prop

  useEffect(() => {
    const fetchLinkedInUser = async () => {
      if (!propUsername) {
        try {
          const response = await fetch('http://localhost:4000/api/linkedin/get-user', {
            method: 'GET',
            credentials: 'include',
          });

          const data = await response.json();
          if (response.ok && data.success && data.user) {
            // Construct full name from firstName and lastName
            const fullName = `${data.user.firstName} ${data.user.lastName}`.trim();
            setUsername(fullName || 'Guest');
          } else {
            setUsername('Guest');
          }
        } catch (error) {
          console.error('Failed to fetch LinkedIn user:', error);
          setUsername('Guest');
        }
      }
    };

    fetchLinkedInUser();
  }, [propUsername]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/logout',
        {},
        {
          withCredentials: true,
        }
      );

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
    <div className="profile">
      <h2>Welcome, {username || 'Guest'}!</h2>
      <p>This is your user profile page.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;