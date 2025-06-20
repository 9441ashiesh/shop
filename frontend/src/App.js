// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Signup from './components/Signup.js';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import './App.css';

function App() {
  const [role, setRole] = useState(null);
  const [products, setProducts] = useState([]);
  const [isSignup, setIsSignup] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const handleLogin = async (username, password, selectedRole, shopName) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
        role: selectedRole,
        shopName,
      });
  
      if (res.data.role === selectedRole) {
        setRole(res.data.role); // ✅ Now role will be either 'admin' or 'user'
        fetchProducts();
      } else {
        alert("Role mismatch: You selected '" + selectedRole + "' but this account is '" + res.data.role + "'");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };
  

  return (
    <div className="App">
      {!role && !isSignup && <Login onLogin={handleLogin} onShowSignup={() => setIsSignup(true)} />}
      {!role && isSignup && <Signup onBackToLogin={() => setIsSignup(false)} />}

      {role === 'admin' && (
        <AdminDashboard products={products} fetchProducts={fetchProducts} />
      )}

      {role === 'user' && <UserDashboard products={products} />}
    </div>
  );
}

export default App;
