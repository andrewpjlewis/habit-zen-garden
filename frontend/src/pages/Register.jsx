import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('https://habit-zen-garden.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('❌ Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label><br />
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label>Last Name:</label><br />
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <button
          onClick={() => navigate('/login')}
          disabled={loading}
          class="default-btn"
        >
          Log in here
        </button>
      </p>
    </div>
  );
}

export default Register;