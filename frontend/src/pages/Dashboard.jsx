import React, { useContext } from 'react';
import { HabitsContext } from '../context/HabitsContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Plant from '../components/Plant';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { habits } = useContext(HabitsContext);
  const navigate = useNavigate();

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
