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
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-primary shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className={`transition-all duration-500 ${
              isHomePage && isHeroVisible ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-light text-lg font-serif">Tregua</span>
              <span className="text-neutral text-xs italic">Cocina de autor</span>
            </div>
          </Link>
          
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <NavigationItems 
              className="flex items-center space-x-8"
              itemClassName="text-light hover:text-accent transition-colors text-sm tracking-widest"
            />
          </nav>

          {/* Social Icons and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <SocialIcons />
            </div>

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
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}