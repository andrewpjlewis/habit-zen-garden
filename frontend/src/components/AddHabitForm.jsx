import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const plants = [
  { id: 1, name: 'Poppy', type: 'poppy', img: '/plants/poppy_phase3.svg' },
  { id: 2, name: 'Sunflower', type: 'sunflower', img: '/plants/sunflower_phase3.svg' },
  { id: 3, name: 'Tulip', type: 'tulip', img: '/plants/tulip_phase3.svg' },
];

function AddHabit({ onAddHabit }) {
  const [selectedPlant, setSelectedPlant] = useState(plants[0].id);
  const [goalName, setGoalName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goalName.trim() || !frequency) {
      alert('Please enter a goal name and frequency');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in');
      return;
    }

    try {
      const selected = plants.find((p) => p.id === selectedPlant);
      const response = await fetch('https://habit-zen-garden.onrender.com/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: goalName.trim(),
          plantType: selected.type,
          frequency: frequency.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const newHabit = await response.json();
      onAddHabit(newHabit);
      setSuccessMessage('Plant added!');
      setGoalName('');
      setFrequency('');
      setSelectedPlant(plants[0].id);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding habit:', err);
      alert(err.message);
    }
  };

  const presetGoals = [
  "Meditate",
  "Workout",
  "Journal",
  "Read book",
  "Stretch",
  "Drink water",
  "Make bed",
  "Check email",
  "Meal prep",
  "Clean room",
  "Walk dog",
  "Call mom",
  "Pray",
  "Review goals",
  "Brush teeth",
  "Floss",
  "Skin care",
  "Plan day",
  "Pack lunch",
  "Do laundry",
  "Water plants",
  "Eat fruit",
  "Inbox zero",
  "Budget check",
  "Post update",
  "Learn code",
  "Study",
  "Cook dinner",
  "Sleep early",
  "Smile more",
];

  return (
    <div className="add-habit-form-container">
      <form className="add-habit-form" onSubmit={handleSubmit}>
        <div className="plant-picker">
          {plants.map((plant) => {
            const isCenter = plant.id === selectedPlant;
            return (
              <div
                key={plant.id}
                className={`circle plant-circle ${isCenter ? 'center' : 'side'}`}
                onClick={() => setSelectedPlant(plant.id)}
              >
                <img src={plant.img} alt={plant.name} />
              </div>
            );
          })}
        </div>
        <p className="habit-title">Select Your Plant</p>

        <div className="goal-name-box">
          <select
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          >
            <option value="">Select Goal</option>
            {presetGoals.map((goal, index) => (
              <option key={index} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        <div className="frequency-section">
          <h3>How often will you complete this goal?</h3>
          <input
            type="number"
            min="1"
            max="7"
            placeholder="Times per week"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>

        <button type="submit">Add Habit</button>

        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
}

export default AddHabit;