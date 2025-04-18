import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported

const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Include password field
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/signup', form); // Correct API endpoint URL
      setMessage(res.data.message || 'Signup successful!');
      navigate('/login'); // Redirect to login page after successful signup
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
        {message && <p className="message">{message}</p>}
      </form>
      <p>
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('/login')}>
          Login here
        </button>
      </p>
    </div>
  );
};

export default Signup;
