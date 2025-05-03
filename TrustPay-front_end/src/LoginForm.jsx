import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function loginUser(userName, email, password) {
  try {
    const response = await fetch('https://localhost:7157/api/Users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log('Login successful:', data);
    return data;
  } catch (err) {
    console.error('Login failed:', err.message);
    throw err;
  }
}

function LoginForm() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(userName, email, password);
      setMessage(data.message || 'Login successful!');

      // Redirecționează către dashboard dacă login reușit
      navigate('/dashboard');
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h1>TrustPay</h1>
      <h2>Enter your account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
