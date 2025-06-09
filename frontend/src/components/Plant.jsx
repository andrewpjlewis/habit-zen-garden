import React from 'react';
import { Link } from 'react-router-dom';

function Plant({ habit }) {
  return (
    <Link to={`/plants/${habit._id}`} className='plant'>
      <p>{habit.frequency}x per week</p>
      <h3>{habit.name}</h3>
      {/* Use template literals for img src */}
      <img src={`/plants/${habit.plantType}.png`} alt={`Plant image for ${habit.name}`} />
    </Link>
  );
}

export default Plant;