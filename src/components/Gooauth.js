import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Gooauth = () => {
  const [message, setMessage] = useState('');

  const responseGoogle = async (response) => {
    if (response.error) {
      setMessage('Google login failed. Please try again.');
      return;
    }

    // Send the token to your backend for verification
    try {
      const res = await axios.post('http://localhost:4000/signup/google', {
        token: response.credential, // Send the token from Google to the backend
      });
      setMessage(res.data.message || 'Signup successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>

      {/* Google Login Button */}
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => console.log('Google login failed')}
      />

      {message && <p>{message}</p>}
    </div>
  );
};

export default Gooauth;
