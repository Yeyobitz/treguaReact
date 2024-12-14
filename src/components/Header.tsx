import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItems } from './navigation/NavigationItems';
import { MobileMenu } from './navigation/MobileMenu';
import { SocialIcons } from './navigation/SocialIcons';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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

  return (
    <header className="fixed w-full z-50 bg-primary/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-serif text-light">
            Tregua
          </Link>
          
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <NavigationItems 
              className="flex items-center space-x-8"
              itemClassName="text-light hover:text-accent transition-colors text-sm tracking-widest"
            />
          </nav>

          {/* Auth Links and Social Icons */}
          <div className="flex items-center space-x-6">
            {/* Auth Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-light hover:text-accent transition-colors text-sm tracking-wide"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/signup"
                className="px-4 py-2 bg-accent text-light rounded-full hover:bg-accent/90 transition-colors text-sm tracking-wide"
              >
                Crear Cuenta
              </Link>
            </div>

            {/* Social Icons */}
            <div className="hidden md:flex items-center">
              <SocialIcons />
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-light p-2 hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <div className="px-4 py-3 space-y-4">
          {/* Mobile Auth Links */}
          <div className="flex flex-col space-y-2">
            <Link 
              to="/login"
              className="text-light hover:text-accent transition-colors text-sm tracking-wide text-center py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/signup"
              className="px-4 py-2 bg-accent text-light rounded-full hover:bg-accent/90 transition-colors text-sm tracking-wide text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </MobileMenu>
    </header>
  );
}