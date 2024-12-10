import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import { useThemeStore } from '../../stores/useThemeStore';

export function AdminLayout() {
  const { user, loading, role } = useAuth();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light dark:bg-primary flex items-center justify-center">
        <div className="text-primary dark:text-light">Cargando...</div>
      </div>
    );
  }

  if (!user || !role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light dark:bg-primary transition-colors">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar role={role} />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}