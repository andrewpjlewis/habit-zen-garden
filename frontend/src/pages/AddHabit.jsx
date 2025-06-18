import React, { useContext } from 'react';
import AddHabitForm from '../components/AddHabitForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { HabitsContext } from '../context/HabitsContext';
import { useNavigate } from 'react-router-dom';

function AddHabit() {
  const { addHabit } = useContext(HabitsContext);
  const navigate = useNavigate();

  const handleAddHabit = (newHabit) => {
    addHabit(newHabit);
    localStorage.removeItem('habitData');
    localStorage.removeItem('habitData_at');
    navigate('/dashboard'); // go back to dashboard after adding
  };

  return (
    <main>
      <Header />
      <AddHabitForm onAddHabit={handleAddHabit} />
      <Footer />
    </main>
  );
}

export default AddHabit;
