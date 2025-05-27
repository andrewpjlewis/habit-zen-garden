import React from 'react';
import AddHabitForm from '../components/AddHabitForm';
import Header from '../components/Header';

function AddHabit() {
  // You can pass a handler here or use context to update habits globally
  return (
    <main>
      <Header />
      <AddHabitForm />
    </main>
  );
}

export default AddHabit;