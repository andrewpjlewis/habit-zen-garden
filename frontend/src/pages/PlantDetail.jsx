import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti'; // <-- import canvas-confetti
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCachedFetch } from '../utils/useCachedFetch';
import { getPlantStage } from '../utils/plantGrowth';

function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { data, loading } = useCachedFetch(
    `https://habit-zen-garden.onrender.com/api/habits/${id}`,
    `habit_${id}`,
    7,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const [habitState, setHabitState] = useState(null);
  const [error, setError] = useState('');
  const [leveledUp, setLeveledUp] = useState(false);

  const habit = habitState || data;

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view this habit.');
    } else {
      setError('');
    }
  }, [token]);

  // Function to run confetti explosion
  function runConfetti() {
    const duration = 7000; // 7 seconds
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration); // decrease particle count over time

      // Left side burst
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 0, y: 0.7 },
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
      });

      // Right side burst
      confetti({
        ...defaults,
        particleCount,
        origin: { x: 1, y: 0.7 },
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
      });
    }, 250);
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      const res = await fetch(`https://habit-zen-garden.onrender.com/api/habits/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete habit');

      localStorage.removeItem('habitData');
      localStorage.removeItem('habitData_at');

      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Error deleting habit');
    }
  };

  const handleComplete = async () => {
    try {
      const oldHabit = habitState || data;

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
      setHabitState(updatedHabit);

      // Show confetti if leveled up
      if (oldHabit && updatedHabit.level > oldHabit.level) {
        setLeveledUp(true);
        runConfetti();
        setTimeout(() => setLeveledUp(false), 7000);
      }

      // Refresh habits cache
      const habitsRes = await fetch('https://habit-zen-garden.onrender.com/api/habits', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (habitsRes.ok) {
        const freshHabits = await habitsRes.json();
        localStorage.setItem('habitData', JSON.stringify(freshHabits));
        localStorage.setItem('habitData_at', Date.now());
      }
    } catch (err) {
      alert(err.message || 'Error completing habit');
    }
  };

  if (loading) return <p>Loading habit...</p>;
  if (error) return <p>{error}</p>;
  if (!habit) return <p>No habit found.</p>;

  const MAX_LEVEL = 10;
  const LEVEL_UP_EXP = 15;

  const isMaxed = habit.level >= MAX_LEVEL && habit.experience === 0;

  const { stage, witheredStage } = getPlantStage(
    Number(habit.level ?? 0),
    Number(habit.witheredLevel ?? 0)
  );

  const plantImgSrc = witheredStage
    ? `/plants/${habit.plantType}_${stage}_${witheredStage}.svg`
    : `/plants/${habit.plantType}_${stage}.svg`;

  const goToAddHabit = () => navigate('/dashboard/add');

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

            {leveledUp && (
              <div className="level-up-animation" style={{ fontSize: 24, fontWeight: 'bold', color: '#4caf50', marginBottom: 20 }}>
                🌟 Your plant leveled up! 🌟
              </div>
            )}

            <div
              className="progress-bar-container"
              style={{
                width: '100%',
                background: '#eee',
                borderRadius: 10,
                height: 20,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: `${(habit.experience / LEVEL_UP_EXP) * 100}%`,
                  background: 'linear-gradient(to right, rgb(45, 108, 83), #4caf50)',
                  height: '100%',
                  borderRadius: 10,
                  transition: 'width 0.5s ease-in-out',
                }}
              />
            </div>

            <p>Experience: {habit.experience || 0} / {LEVEL_UP_EXP}</p>
            <p>Level: {habit.level}</p>
            <p>
              Streak: {habit.streak} week{habit.streak !== 1 ? 's' : ''} in a row
            </p>

            <button className="delete-button" onClick={handleDelete}>
              Delete Habit
            </button>

            <button
              className={`watering-can-button ${isMaxed ? 'disabled' : ''}`}
              onClick={handleComplete}
              disabled={isMaxed}
              title={isMaxed ? 'Max experience reached' : 'Water plant'}
            >
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
      <Footer onAddClick={goToAddHabit} />
    </>
  );
}

export default PlantDetail;