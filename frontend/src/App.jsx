import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddHabit from './pages/AddHabit';
import Welcome from './pages/Welcome';
import PlantDetail from './pages/PlantDetail';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import Social from './pages/Social';
import Calendar from './pages/Calendar';

import { HabitsProvider } from './context/HabitsContext';

// Helper wrapper for protected routes
function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <HabitsProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Private routes */}
          <Route path="/welcome" element={<PrivateRoute><Welcome /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/dashboard/add" element={<PrivateRoute><AddHabit /></PrivateRoute>} />
          <Route path="/plants/:id" element={<PrivateRoute><PlantDetail /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/shop" element={<PrivateRoute><Shop /></PrivateRoute>} />
          <Route path="/social" element={<PrivateRoute><Social /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />

          {/* Root redirect */}
          <Route
            path="/"
            element={
              <Navigate to={useAuth().isLoggedIn ? "/dashboard" : "/login"} replace />
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HabitsProvider>
  );
}

export default App;