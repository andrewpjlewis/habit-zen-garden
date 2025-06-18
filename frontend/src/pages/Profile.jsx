import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCachedFetch } from '../utils/useCachedFetch';

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const cacheKey = `profileData_${userId}`; // cache key per user

  const { data: user, loading } = useCachedFetch(
    'https://habit-zen-garden.onrender.com/api/auth/profile',
    cacheKey,
    10,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      const res = await fetch('https://habit-zen-garden.onrender.com/api/auth/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete account');

      alert('Account deleted successfully');
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      alert(err.message || 'Error deleting account');
    }
  };

  if (loading) return <p>Loading profile...</p>;

  if (!user) {
    return <p class="noUser">No user info available. Please make sure you're logged in.</p>;
  }

  // Format joined date safely
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <>
      <Header />
      <main>
        <div className="profile-container">
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {joinedDate}</p>

          <button
            className="delete-account-button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Profile;
