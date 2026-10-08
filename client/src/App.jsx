import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/public/LandingPage';
import BrowseFood from './pages/public/BrowseFood';
import FoodDetail from './pages/food/FoodDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import RestaurantDashboard from './pages/restaurant/Dashboard';
import CreateListing from './pages/restaurant/CreateListing';
import Listings from './pages/restaurant/Listings';
import MyClaims from './pages/claims/MyClaims';
import Notifications from './pages/notifications/Notifications';
import AdminDashboard from './pages/admin/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user) {
    // Redirect based on role
    if (user.role === 'RESTAURANT') {
      return <Navigate to="/restaurant/dashboard" replace />;
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowseFood />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        
        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* NGO/Volunteer Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['NGO', 'VOLUNTEER']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/claims"
          element={
            <ProtectedRoute roles={['NGO', 'VOLUNTEER']}>
              <MyClaims />
            </ProtectedRoute>
          }
        />

        {/* Restaurant Routes */}
        <Route
          path="/restaurant/dashboard"
          element={
            <ProtectedRoute roles={['RESTAURANT']}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/listings"
          element={
            <ProtectedRoute roles={['RESTAURANT']}>
              <Listings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurant/listings/create"
          element={
            <ProtectedRoute roles={['RESTAURANT']}>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared Protected Routes */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl">404 - Page Not Found</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
