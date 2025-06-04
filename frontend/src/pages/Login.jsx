import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState(''); // email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://habit-zen-garden.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username.trim(), password }),
      });

      const text = await res.text();
      console.log('Raw response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error('❌ Failed to parse JSON:', jsonErr);
        alert('Unexpected server response. Please try again.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        alert(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('✅ Login successful:', data);

      // Pass userId and token to AuthContext login
      login({ userId: data.userId, token: data.token });
      console.log('Login user:', { userId: data.userId, token: data.token });

      navigate('/welcome');
    } catch (error) {
      console.error('❌ Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don't have an account?{' '}
        <button
          onClick={() => navigate('/register')}
          style={{
            background: 'none',
            border: 'none',
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            fontSize: '1rem'
          }}
          disabled={loading}
        >
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;
