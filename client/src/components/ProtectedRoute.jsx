import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}
