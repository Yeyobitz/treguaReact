import { Check, X, Clock } from 'lucide-react';
import { Reservation } from '../../types/reservation';

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Clock className="w-4 h-4" />,
    text: 'Pendiente'
  },
  confirmed: {
    color: 'bg-green-100 text-green-800',
    icon: <Check className="w-4 h-4" />,
    text: 'Confirmada'
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    icon: <X className="w-4 h-4" />,
    text: 'Cancelada'
  }
} as const;

interface ReservationStatusBadgeProps {
  status: Reservation['status'];
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      <span className="ml-1">{config.text}</span>
    </span>
  );
}