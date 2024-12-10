import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../stores/useThemeStore';
import { LogOut, Moon, Sun } from 'lucide-react';

export function AdminNavbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <nav className="bg-primary dark:bg-primary/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-serif text-light">Panel Administrativo</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-light text-sm">{user?.email}</span>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-light hover:text-accent transition-colors"
              aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-light hover:text-accent transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}