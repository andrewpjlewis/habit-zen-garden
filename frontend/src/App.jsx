import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddHabit from './pages/AddHabit';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <Route 
          path="/" 
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;