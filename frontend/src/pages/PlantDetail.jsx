import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCachedFetch } from '../utils/useCachedFetch';
import { getPlantStage } from '../utils/plantGrowth';

function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data: habit, loading } = useCachedFetch(
    `https://habit-zen-garden.onrender.com/api/habits/${id}`,
    `habit_${id}`,
    10,
    options
  );

  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view this habit.');
    } else {
      setError('');
    }
  }, [token]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
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
      const res = await fetch(`https://habit-zen-garden.onrender.com/api/habits/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to complete habit');

      const updatedHabit = await res.json();

      localStorage.setItem(`habit_${id}`, JSON.stringify(updatedHabit));
      localStorage.setItem(`habit_${id}_at`, Date.now());

      window.location.reload();
    } catch (err) {
      alert(err.message || 'Error completing habit');
    }
  };

  if (loading) return <p>Loading habit...</p>;
  if (error) return <p>{error}</p>;
  if (!habit) return <p>No habit found.</p>;

  const isMaxed = habit.progress >= 100;

  const stage = getPlantStage(habit.level);
  const plantImgSrc = `/plants/${habit.plantType}_${stage}.svg`

  return (
    <>
      <Header />
      <main>
        <div className="plant-detail-container">
          <div className="plant-detail">
            <h2>{habit.name}</h2>
            <img
              src={plantImgSrc}
              alt={`Plant image for ${habit.name}`}
              className="plant-image"
            />
            
            {/* Progress Bar For Level Up*/}
            <div className="progress-bar-container" style={{ width: '100%', background: '#eee', borderRadius: 10, height: 20, marginBottom: 10 }}>
              <div
                style={{
                  width: `${habit.progress}%`,
                  backgroundColor: '#4caf50',
                  height: '100%',
                  borderRadius: 10,
                  transition: 'width 0.5s ease-in-out',
                }}
              />
            </div>

            <p>Progress: {habit.progress} / {habit.frequency}</p>
            <p>Frequency: {habit.frequency}x per week</p>
            <p>Streak: {habit.streak} week{habit.streak !== 1 ? 's' : ''} in a row</p>

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
