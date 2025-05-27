import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import AddHabitForm from '../components/AddHabitForm';
import Header from '../components/Header';
import Plant from '../components/Plant';

function Dashboard() {
    const navigate = useNavigate();
  // Initial habits array
  const [habits, setHabits] = useState([
    { id: 1, name: "Read Scriptures", frequency: 17 },
    { id: 2, name: "Make Bed", frequency: 3 },
    { id: 3, name: "Workout", frequency: 11 },
    // add more as needed
  ]);

  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  // Add new habit from form submission
  const handleAddHabit = (newHabit) => {
    setHabits(prevHabits => [
      ...prevHabits,
      { id: prevHabits.length + 1, ...newHabit }
    ]);
    setShowForm(false); // hide form after adding
  };

  const goToAddHabit = () => {
    navigate('/dashboard/add');
  };

  return (
    <main>
      <Header />
      <div className="content">
        {habits.map(habit => (
          <Plant key={habit.id} habit={habit} />
        ))}
      </div>
      <Footer onAddClick={goToAddHabit} />
    </main>
  );
}

export default Dashboard;
