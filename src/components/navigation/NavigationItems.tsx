import { Link, useNavigate } from 'react-router-dom';

interface NavigationItemsProps {
  className?: string;
  itemClassName?: string;
  onClick?: () => void;
}

export function NavigationItems({ className, itemClassName, onClick }: NavigationItemsProps) {
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Reservas', path: '/reservas' },
    { name: 'Platos', path: '/platos' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' }
  ];

  const handleClick = (path: string) => {
    if (onClick) onClick();
    navigate(path);
  };

  return (
    <div className={className}>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => handleClick(item.path)}
          className={`${itemClassName} relative group`}
        >
          {item.name}
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
        </button>
      ))}
    </div>
  );
}