import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Role } from '../../types/auth';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role[];
}

export function AdminProtectedRoute({ children, requiredRole }: AdminProtectedRouteProps) {
  const { user, role, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  if (!user || !role) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !requiredRole.includes(role)) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}