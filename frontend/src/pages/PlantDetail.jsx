import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

  if (loading) return <p>Loading habit...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!habit) return <p>No habit found.</p>;

  return (
    <div className="plant-detail">
      <h2>{habit.name}</h2>
      <p>Frequency: {habit.frequency}x per week</p>
      <p>Progress: {habit.progress}</p>
      <img src={`/plants/${habit.plantType}.png`} alt={`Plant image for ${habit.name}`} />
      <button onClick={handleDelete} style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}>
        Delete Habit
      </button>
    </div>
  );
}

export default PlantDetail;
