import { NavLink } from 'react-router-dom';
import { Calendar, UtensilsCrossed, Users } from 'lucide-react';
import { Role } from '../../types/auth';

interface AdminSidebarProps {
  role: Role;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles: Role[];
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const navItems: NavItem[] = [
    {
      to: '/admin/reservas',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Reservas',
      roles: ['admin', 'manager', 'crew'],
    },
    {
      to: '/admin/platos',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      label: 'Platos',
      roles: ['admin', 'manager'],
    },
    {
      to: '/admin/usuarios',
      icon: <Users className="w-5 h-5" />,
      label: 'Usuarios',
      roles: ['admin', 'manager'],
    }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white dark:bg-primary/50 shadow-lg">
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-lg transition-colors
              ${isActive 
                ? 'bg-accent text-light' 
                : 'text-primary/60 dark:text-light/60 hover:bg-primary/5 dark:hover:bg-light/5'
              }
            `}
          >
            {item.icon}
            <span className="ml-3 text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}