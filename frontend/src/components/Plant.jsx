import React from 'react';
import { Link } from 'react-router-dom';
import { getPlantStage } from '../utils/plantGrowth';

function Plant({ habit }) {
  const stage = getPlantStage(habit.level, habit.witherLevel || 0);
  const plantImgSrc = `/plants/${habit.plantType}_${stage}.svg`;

  return (
    <Link to={`/plants/${habit._id}`} className="plant">
      <div id='plant-title'>
        <h3>{habit.name}</h3>
        <p>{habit.frequency}x per week</p>
      </div>
      <img src={plantImgSrc} alt={`Plant image for ${habit.name}`} />
    </Link>
  );
}

export default Plant;
