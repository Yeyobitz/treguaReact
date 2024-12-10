import { useState } from 'react';
import { X } from 'lucide-react';
import { cancelReservation } from '../../services/reservations';

interface CancelReservationButtonProps {
  reservationId: string;
  onCancel: () => void;
}

export function CancelReservationButton({ reservationId, onCancel }: CancelReservationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (window.confirm('¿Está seguro que desea cancelar esta reserva?')) {
      setIsLoading(true);
      try {
        await cancelReservation(reservationId);
        onCancel();
      } catch (error) {
        console.error('Error cancelling reservation:', error);
        alert('Error al cancelar la reserva');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <X className="w-4 h-4 mr-2" />
      {isLoading ? 'Cancelando...' : 'Cancelar reserva'}
    </button>
  );
}