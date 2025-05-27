import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';

const plants = [
  { id: 1, name: 'Plant 1', img: 'plant1.png' },
  { id: 2, name: 'Plant 2', img: 'plant2.png' },
  { id: 3, name: 'Plant 3', img: 'plant3.png' },
];

function AddHabitForm() {
  const [selectedPlant, setSelectedPlant] = useState(plants[0].id);
  const [goalName, setGoalName] = useState('');

  return (
    <div className="add-habit-form-container">
      <form className="add-habit-form" onSubmit={(e) => e.preventDefault()}>
        {/* Carousel */}
        <div className="plant-picker">
          {plants.map((plant, idx) => {
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

        {/* Input area for goal name */}
        <div className="goal-name-box">
          <input
            type="text"
            placeholder="Add Goal Name"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
          <FaPencilAlt className="pencil-icon" />
        </div>

        {/* Frequency setup */}
        <div className="frequency-section">
          <h3>How often will you complete this goal?</h3>
          <input type="number" min="1" placeholder="Times per week" />
        </div>

        <button type="submit">Add Habit</button>
      </form>
    </div>
  );
}

export default AddHabitForm;
