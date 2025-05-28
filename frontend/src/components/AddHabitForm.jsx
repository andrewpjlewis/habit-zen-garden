import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const plants = [
  { id: 1, name: 'Plant 1', img: 'plant1.png' },
  { id: 2, name: 'Plant 2', img: 'plant2.png' },
  { id: 3, name: 'Plant 3', img: 'plant3.png' },
];

function AddHabit({ onAddHabit }) {
  const [selectedPlant, setSelectedPlant] = useState(plants[0].id);
  const [goalName, setGoalName] = useState('');
  const [frequency, setFrequency] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalName.trim() || !frequency) {
      alert('Please enter a goal name and frequency');
      return;
    }

    const newHabit = {
      id: Date.now(),
      name: goalName.trim(),
      frequency: Number(frequency),
      plantId: selectedPlant,
    };

    onAddHabit(newHabit);

    // Show success message
    setSuccessMessage('Plant added!');

    // Reset form fields
    setGoalName('');
    setFrequency('');
    setSelectedPlant(plants[0].id);

    // Hide success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

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
          <input
            type="text"
            placeholder="Add Goal Name"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
          <FaPencilAlt className="pencil-icon" />
        </div>

        <div className="frequency-section">
          <h3>How often will you complete this goal?</h3>
          <input
            type="number"
            min="1"
            placeholder="Times per week"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>

        <button type="submit">Add Habit</button>

        {/* Show success message */}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
}

export default AddHabit;
