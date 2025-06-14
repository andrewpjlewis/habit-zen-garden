import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHabit = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view this habit.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://habit-zen-garden.onrender.com/api/habits/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch habit');

        const data = await res.json();
        setHabit(data);
      } catch (err) {
        setError(err.message || 'Error fetching habit');
      } finally {
        setLoading(false);
      }
    };

    fetchHabit();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://habit-zen-garden.onrender.com/api/habits/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete habit');

      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Error deleting habit');
    }
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://habit-zen-garden.onrender.com/api/habits/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to complete habit');

      const updatedHabit = await res.json();
      setHabit(updatedHabit);
    } catch (err) {
      alert(err.message || 'Error completing habit');
    }
  };

  if (loading) return <p>Loading habit...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!habit) return <p>No habit found.</p>;

  const isMaxed = habit.progress >= habit.frequency;

  return (
    <>
      <Header />
      <main>
        <div className="plant-detail-container">
          <div className="plant-detail">
            <h2>{habit.name}</h2>
            <img
              src={`/plants/${habit.plantType}.png`}
              alt={`Plant image for ${habit.name}`}
              className="plant-image"
            />
            <p>Progress: {habit.progress} / {habit.frequency}</p>
            <p>Frequency: {habit.frequency}x per week</p>

            <button
              className="delete-button"
              onClick={handleDelete}
            >
              Delete Habit
            </button>

            <button
              className="watering-can-button"
              onClick={handleComplete}
              disabled={isMaxed}
              title={isMaxed ? "Max progress reached" : "Water plant"}
            >
              {/* Inline SVG for watering can */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`watering-can-icon ${isMaxed ? 'disabled' : ''}`}
              >
                <path
                  fill={isMaxed ? '#aaa' : '#3498db'}
                  d="M19 5c-.6 0-1 .4-1 1v2.1l-3.2-.6c-.3-.1-.5.1-.6.3l-.8 2.1-2-1.1V8c0-.6-.4-1-1-1s-1 .4-1 1v1.5L6 10V8c0-.6-.4-1-1-1s-1 .4-1 1v2.3c0 .5.3.8.7.9l5.3 1.2-1.7 5.6c-.2.6.2 1.3.9 1.4.6.2 1.3-.2 1.4-.9l1.8-6.1 2.6 1.4c.5.3 1.1.1 1.4-.4l1.1-2.9 2.1.4V18c0 .6.4 1 1 1s1-.4 1-1V6c0-.6-.4-1-1-1z"
                />
              </svg>
              {isMaxed ? 'Done' : 'Water Plant'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PlantDetail;
