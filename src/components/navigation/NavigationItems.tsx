import { Link, useLocation } from 'react-router-dom';

interface NavigationItemsProps {
  className?: string;
  itemClassName?: string;
  onClick?: () => void;
}

export function NavigationItems({ className, itemClassName, onClick }: NavigationItemsProps) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Reservas', path: '/reservas' },
    { name: 'Platos', path: '/platos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' }
  ];

  return (
    <div className={className}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={`${itemClassName} relative group overflow-hidden`}
          >
            <span className="relative z-10 transition-colors duration-300">
              {item.name}
            </span>
            
            {/* Línea inferior animada */}
            <span 
              className={`absolute bottom-0 left-0 w-full h-px transform transition-transform duration-300 ease-out ${
                isActive 
                  ? 'bg-accent scale-x-100' 
                  : 'bg-accent scale-x-0 group-hover:scale-x-100'
              }`}
            />

            {/* Efecto de hover */}
            <span 
              className={`absolute inset-0 bg-light/5 transform transition-transform duration-300 origin-left ${
                isActive 
                  ? 'scale-x-100' 
                  : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}