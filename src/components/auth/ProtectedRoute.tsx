import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
<<<<<<< HEAD

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
=======
import { Role } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
>>>>>>> aeb5e800b3e81837841ec0f3c7e5318d1e3f3083
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

<<<<<<< HEAD
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
=======
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/admin/reservas" />;
    }
>>>>>>> aeb5e800b3e81837841ec0f3c7e5318d1e3f3083
  }

  return <>{children}</>;
} 