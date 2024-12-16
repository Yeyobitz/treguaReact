import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/admin/reservas" />;
    }
  }

  return <>{children}</>;
} 