import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Plant from '../components/Plant';
import { useNavigate } from 'react-router-dom';
import { useCachedFetch } from '../utils/useCachedFetch';

function Dashboard() {
  const token = localStorage.getItem('token');

  const { data: habits, loading } = useCachedFetch(
    'https://habit-zen-garden.onrender.com/api/habits',
    'habitData',
    10,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const navigate = useNavigate();
  const goToAddHabit = () => navigate('/dashboard/add');

  return (
    <>
      <Header />
      <main>
        <div className="content">
          {loading ? (
            <p>Loading your plants...</p>
          ) : habits?.length > 0 ? (
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