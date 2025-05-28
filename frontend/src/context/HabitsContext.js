import React, { createContext, useState } from 'react';

export const HabitsContext = createContext();

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([
    { id: 1, name: "Read Scriptures", frequency: 17 },
    { id: 2, name: "Make Bed", frequency: 3 },
    { id: 3, name: "Workout", frequency: 11 },
  ]);

  const addHabit = (newHabit) => {
    setHabits(prev => [...prev, { id: Date.now(), ...newHabit }]);
  };

  return (
    <HabitsContext.Provider value={{ habits, addHabit }}>
      {children}
    </HabitsContext.Provider>
  );
}