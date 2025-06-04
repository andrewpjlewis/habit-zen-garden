// HabitsContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const HabitsContext = createContext();

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const { user } = useAuth();

  // Fetch habits when user/token changes
  useEffect(() => {
  if (!user?.token) {
    setHabits([]);
    return;
  }

  const fetchHabits = async () => {
    try {
      const res = await fetch('https://habit-zen-garden.onrender.com/api/habits', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setHabits(data);
      } else if (res.status === 401) {
        console.warn('Unauthorized. Please login again.');
        setHabits([]);
        // You might want to trigger logout here as well
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      setHabits([]);
    }
  };

  fetchHabits();
}, [user]);

  const addHabit = (newHabit) => {
    setHabits(prev => [...prev, { id: Date.now(), ...newHabit }]);
  };

  return (
    <HabitsContext.Provider value={{ habits, addHabit, setHabits }}>
      {children}
    </HabitsContext.Provider>
  );
}
