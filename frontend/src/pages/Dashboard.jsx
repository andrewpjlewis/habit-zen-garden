import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Plant from '../components/Plant'; // Import the single habit card component
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();

  const fetchHabits = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Redirecting to login...');
      return;
    }

    try {
      const res = await fetch('https://habit-zen-garden.onrender.com/api/habits', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch habits');

      const data = await res.json();
      setHabits(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const goToAddHabit = () => {
    navigate('/dashboard/add');
  };

  return (
    <>
      <Header />
      <main>
        <div className="content">
          {habits.length > 0 ? (
            habits.map((habit) => <Plant key={habit._id} habit={habit} />)
          ) : (
            <p id="contentBlank">No habits found. Add some habits to get started!</p>
          )}
        </div>
      </main>
      <Footer onAddClick={goToAddHabit} />
    </>
  );
}

export default Dashboard;
