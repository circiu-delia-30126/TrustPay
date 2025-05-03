import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';


async function loginUser(userName, email, password) {
  try {
    const response = await fetch('https://localhost:7157/api/Users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

function LoginForm({ onLogin }) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(userName, email, password);
      if (data.message === "Login successful") {
        setMessage(data.message);
        onLogin({ userId: data.userId, userName: data.userName }); // salvăm întregul obiect
        navigate('/dashboard');
      } else {
        setMessage("Login failed: " + data.message);
      }
    } catch (error) {
      setMessage("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>TrustPay</h1>
      <h2>Enter your account</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ marginTop: '10px', color: 'white' }}>{message}</p>}
    </div>
  );
}

export default LoginForm;
