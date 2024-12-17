import { Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItems } from './navigation/NavigationItems';
import { MobileMenu } from './navigation/MobileMenu';
import { SocialIcons } from './navigation/SocialIcons';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('#hero');
      if (isHomePage && heroSection) {
        const rect = heroSection.getBoundingClientRect();
        setIsHeroVisible(rect.bottom > 0);
      } else {
        setIsHeroVisible(false);
      }
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const headerClasses = `fixed w-full z-50 transition-all duration-300 ${
    isScrolled
      ? 'bg-primary/95 backdrop-blur-sm py-2 shadow-lg'
      : isHeroVisible
      ? 'bg-transparent py-4'
      : 'bg-primary py-3'
  }`;

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="relative group"
          >
            <span className="text-2xl font-serif text-light tracking-wider transition-colors group-hover:text-accent">
              Tregua
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <NavigationItems 
              className="flex items-center justify-center space-x-12"
              itemClassName="text-light hover:text-accent transition-colors text-sm tracking-widest uppercase"
            />
          </nav>

          {/* Right Section: Auth & Social */}
          <div className="flex items-center space-x-4">
            {/* Auth Links - Desktop */}
            <div className="hidden lg:flex items-center text-xs space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/perfil"
                    className="text-light/80 hover:text-accent transition-colors"
                    title="Mi Perfil"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={logout}
                    className="text-light/80 hover:text-accent transition-colors tracking-wide"
                  >
                    salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/login"
                    className="text-light/80 hover:text-accent transition-colors tracking-wide"
                  >
                    entrar
                  </Link>
                  <span className="text-light/20 text-[10px]">|</span>
                  <Link 
                    to="/signup"
                    className="text-light/80 hover:text-accent transition-colors tracking-wide"
                  >
                    registro
                  </Link>
                </div>
              )}
            </div>

            {/* Social Icons - Desktop */}
            <div className="hidden lg:flex items-center pl-3 border-l border-light/10">
              <SocialIcons className="h-4 w-4" />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="relative w-10 h-10 flex items-center justify-center text-light hover:text-accent transition-colors focus:outline-none lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <div className="absolute inset-0 rounded-full hover:bg-light/5 transition-colors" />
              {isMenuOpen ? (
                <X className="h-6 w-6 relative z-10" />
              ) : (
                <Menu className="h-6 w-6 relative z-10" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        user={user}
        onLogout={logout}
      />
    </header>
  );
}