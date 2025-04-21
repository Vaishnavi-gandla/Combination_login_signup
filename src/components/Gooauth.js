// import React, { useState } from 'react';
// import { GoogleLogin } from '@react-oauth/google';
// import axios from 'axios';

// const Gooauth = () => {
//   const [message, setMessage] = useState('');

//   const responseGoogle = async (response) => {
//     if (response.error) {
//       setMessage('Google login failed. Please try again.');
//       return;
//     }

//     // Send the token to your backend for verification
//     try {
//       const res = await axios.post('http://localhost:4000/signup/google', {
//         token: response.credential, // Send the token from Google to the backend
//       });
//       setMessage(res.data.message || 'Signup successful!');
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Signup failed');
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: 'auto' }}>

//       {/* Google Login Button */}
//       <GoogleLogin
//         onSuccess={responseGoogle}
//         onError={() => console.log('Google login failed')}
//       />

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Gooauth;



import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Gooauth = ({ setIsAuthenticated, setUsername }) => {
  const navigate = useNavigate();

  const responseGoogle = async (response) => {
    if (response.error) {
      console.error('Google login failed. Please try again.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/signup/google', {
        token: response.credential,
      });

      const { user } = res.data;

      // Simulate token setting if needed (optional, you can also generate it server-side)
      localStorage.setItem('token', 'google_oauth_token'); // fake token or send actual token from backend if available
      setIsAuthenticated(true);
      setUsername(`${user.firstName} ${user.lastName}`);
      navigate('/home'); // 👈 redirect to home
    } catch (err) {
      console.error(err.response?.data?.message || 'Google signup failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => console.log('Google login failed')}
      />
    </div>
  );
};

export default Gooauth;
