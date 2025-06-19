// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';

const Signup = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user',
  });

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
      setMessage(res.data.message);
      setTimeout(() => {
        onBackToLogin(); // Go back to login screen
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Something went wrong');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        /><br />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        /><br />

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select><br /><br />

        <button type="submit">Register</button><br />
        <p style={{ marginTop: '10px' }}>
          Already have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onBackToLogin}>Login</span>
        </p>

        {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
      </form>
    </div>
  );
};

export default Signup;
