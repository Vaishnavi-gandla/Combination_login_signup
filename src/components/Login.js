import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported


const Login = ({ setIsAuthenticated, setUsername }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [form,setForm]=useState({email:'',password:''})
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });
      const { token, username } = response.data;

      localStorage.setItem('token', token); // Store token in localStorage
      setIsAuthenticated(true); // Set authenticated state
      setUsername(username); // Set username state
      setForm({email:'',password:''})
      navigate('/home'); // Navigate to the home page
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      alert(errorMessage); // Show error message
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button type="button" onClick={() => navigate('/signup')}>
          Signup here
        </button>
      </p>
      <p>Or login using:</p>
      <div id="google-login-button" style={{ marginTop: '20px' }}></div>
    </div>
  );
};

export default Login;
