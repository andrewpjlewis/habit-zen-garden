import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState(''); // used as email
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('https://habit-zen-garden-frontend.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Login failed');
                return;
            }

            console.log('✅ Login successful:', data);
            login({ userId: data.userId });
            navigate('/welcome');
        } catch (error) {
            console.error('❌ Login error:', error);
            alert('Login failed. Please try again.');
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
                    />
                </div>

                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Log In</button>
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
                >
                  Register here
                </button>
            </p>
        </div>
    );
}

export default Login;
