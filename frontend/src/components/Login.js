// src/components/Login.js
import React, { useState } from 'react';

const Login = ({ onLogin, onShowSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default to 'user'

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password, role);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select><br /><br />

        <button type="submit">Login</button><br />
        <p style={{ marginTop: '10px' }}>
          Don’t have an account?{' '}
          <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onShowSignup}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
