import { Link } from 'react-router-dom';
import { SocialIcons } from './SocialIcons';
import { NavigationItems } from './NavigationItems';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Overlay to handle click outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Menu Panel */}
      <div 
        className={`fixed top-20 right-0 w-64 h-auto bg-primary shadow-lg transform transition-transform duration-300 ease-in-out z-50 rounded-l-xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <nav className="py-8 px-6">
          <div className="flex flex-col items-start space-y-6">
            <NavigationItems 
              className="flex flex-col items-start space-y-6"
              itemClassName="text-light hover:text-accent transition-colors text-sm tracking-widest"
              onClick={onClose}
            />
            
            <div className="pt-6 border-t border-neutral/10 w-full">
              <div className="flex items-center space-x-4">
                <SocialIcons className="h-5 w-5" />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}