import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/auth';
import { useEffect } from 'react';
import { useToast } from '../../hooks/useToast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, role } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    // Verificar si el usuario intenta acceder a una ruta protegida sin los permisos necesarios
    if (!loading && user && requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!role || !allowedRoles.includes(role)) {
        showToast('No tienes permisos para acceder a esta sección', 'error');
      }
    }
  }, [user, role, loading, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  if (!user) {
    // Guardar la ruta intentada para redireccionar después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!role || !allowedRoles.includes(role)) {
      // Si el usuario no tiene el rol requerido, redirigir a una página de acceso denegado
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Verificar si es una ruta administrativa y el usuario tiene los permisos necesarios
  if (location.pathname.startsWith('/admin') && (!role || !['admin', 'manager'].includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
} 