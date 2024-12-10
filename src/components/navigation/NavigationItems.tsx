import { Link } from 'react-router-dom';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

interface NavigationItemsProps {
  className?: string;
  itemClassName?: string;
  onClick?: () => void;
}

export function NavigationItems({ className, itemClassName, onClick }: NavigationItemsProps) {
  const { smoothNavigate } = useSmoothScroll();
  
  const navItems = [
    { name: 'Reservas', path: '/reservas' },
    { name: 'Platos', path: '/platos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' }
  ];

  const handleClick = (path: string) => {
    if (onClick) onClick();
    smoothNavigate(path);
  };

  return (
    <div className={className}>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => handleClick(item.path)}
          className={itemClassName}
        >
          {item.name}
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
        </button>
      ))}
    </div>
  );
}