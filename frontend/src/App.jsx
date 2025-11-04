import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import LoginGlassEnhanced from './pages/LoginGlassEnhanced';
import Register from './pages/Register';
import AboutUs from './pages/AboutUs';
import RoutesMap from './pages/RoutesMap';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserTasks from './pages/user/Tasks';
import UserGames from './pages/user/Games';
import UserWallet from './pages/user/Wallet';
import UserProfile from './pages/user/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminEconomy from './pages/admin/Economy';
import AdminActivity from './pages/admin/Activity';

// Protected Route Wrapper
function ProtectedRoute({ children, requireAdmin = false }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/home" replace />;
  }
  
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  const userType = user?.isAdmin ? 'admin' : 'user';
  
  return (
    <ThemeProvider userType={userType}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<LoginGlassEnhanced />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/routes" element={<RoutesMap />} />
        
        {/* User Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <UserTasks />
          </ProtectedRoute>
        } />
        <Route path="/games" element={
          <ProtectedRoute>
            <UserGames />
          </ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <UserWallet />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/economy" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminEconomy />
          </ProtectedRoute>
        } />
        <Route path="/admin/activity" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminActivity />
          </ProtectedRoute>
        } />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
