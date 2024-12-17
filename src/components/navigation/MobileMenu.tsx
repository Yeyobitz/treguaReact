import { Link } from 'react-router-dom';
import { SocialIcons } from './SocialIcons';
import { NavigationItems } from './NavigationItems';
import { User } from 'lucide-react';
import { User as UserType } from '../../types/user';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, user, onLogout }: MobileMenuProps) {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <>
      {/* Overlay con blur */}
      <div 
        className={`fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Panel del menú */}
      <div 
        className={`fixed top-0 right-0 w-80 h-full bg-primary shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header del menú */}
          <div className="p-6 border-b border-light/10">
            <Link 
              to="/" 
              className="block text-2xl font-serif text-light text-center"
              onClick={onClose}
            >
              Tregua
            </Link>
          </div>

          {/* Contenido del menú */}
          <div className="flex-1 overflow-y-auto py-8">
            {/* Auth Links */}
            <div className="px-6 mb-8">
              {user ? (
                <div className="flex items-center justify-center space-x-6">
                  <Link 
                    to="/perfil"
                    className="text-light hover:text-accent transition-colors"
                    onClick={onClose}
                    title="Mi Perfil"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <span className="text-light/20">|</span>
                  <button 
                    onClick={handleLogout}
                    className="text-light hover:text-accent transition-colors text-sm tracking-wide"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4">
                  <Link 
                    to="/login"
                    className="text-light hover:text-accent transition-colors text-sm tracking-wide"
                    onClick={onClose}
                  >
                    Entrar
                  </Link>
                  <span className="text-light/20">|</span>
                  <Link 
                    to="/signup"
                    className="text-light hover:text-accent transition-colors text-sm tracking-wide"
                    onClick={onClose}
                  >
                    Registro
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="px-6 mb-8">
              <NavigationItems 
                className="flex flex-col space-y-6"
                itemClassName="text-light hover:text-accent transition-colors text-sm tracking-widest uppercase text-center"
                onClick={onClose}
              />
            </div>

            {/* Separador */}
            <div className="w-16 h-px bg-light/10 mx-auto mb-8" />

            {/* Social Icons */}
            <div className="flex justify-center space-x-6">
              <SocialIcons className="h-5 w-5" />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-light/10">
            <p className="text-light/40 text-xs text-center">
              © {new Date().getFullYear()} Tregua Restaurant
            </p>
          </div>
        </div>
      </div>
    </>
  );
}