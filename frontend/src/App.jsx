import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register'; // import Register page
import Dashboard from './pages/Dashboard';
import AddHabit from './pages/AddHabit';
import Welcome from './pages/Welcome';
import PlantDetail from './pages/PlantDetail'

import { HabitsProvider } from './context/HabitsContext'; // import the context provider

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <HabitsProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/welcome" 
            element={isLoggedIn ? <Welcome /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/add" 
            element={isLoggedIn ? <AddHabit /> : <Navigate to="/login" />} 
          />
          <Route path="/plants/:id" element={<PlantDetail />} />
          <Route 
            path="/" 
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </HabitsProvider>
  );
}

export default App;
