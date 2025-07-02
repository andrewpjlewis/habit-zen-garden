import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const text = await res.text();

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

      // Save user data
      login({
        userId: data.userId,
        token: data.token,
        firstname: data.firstname,
        lastname: data.lastname,
      });

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p>
        Don't have an account?{' '}
        <button
          onClick={() => navigate('/register')}
          disabled={loading}
          class="default-btn"
        >
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;