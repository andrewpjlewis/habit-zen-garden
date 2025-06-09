import React from 'react';
import { Link } from 'react-router-dom';

function Plant({ habit }) {
  return (
    <Link to={`/plants/${habit._id}`} className="plant">
      <p>{habit.frequency}x per week</p>
      <h3>{habit.name}</h3>
      {/* Always load phase 1 of the selected plantType */}
      <img
        src={`/plants/${habit.plantType}_phase1.svg`}
        alt={`Plant image for ${habit.name}`}
      />
    </Link>
  );
}

export default Plant;
