function Plant({ habit }) {
  return (
    <div className="plant">
      <h3>{habit.name}</h3>
      <p>{habit.frequency}x per week</p>
    </div>
  );
}

export default Plant;
