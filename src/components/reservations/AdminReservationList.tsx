import { useReservationStore } from '../../stores/useReservationStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { Reservation } from '../../types/reservation';
import { Toast } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';

interface AdminReservationListProps {
  reservations: Reservation[];
}

export function AdminReservationList({ reservations }: AdminReservationListProps) {
  const { updateReservationStatus } = useReservationStore();
  const { toast, showToast, hideToast } = useToast();

  const handleStatusUpdate = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus(id, status);
      showToast(
        status === 'confirmed' 
          ? 'Reserva confirmada exitosamente'
          : 'Reserva cancelada exitosamente'
      );
    } catch (error) {
      showToast('Error al actualizar el estado de la reserva', 'error');
    }
  };

  if (reservations.length === 0) {
    return (
      <div className="bg-white dark:bg-primary/50 rounded-xl p-8 text-center transition-colors">
        <p className="text-primary/60 dark:text-light/60">No hay reservas para mostrar</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((reservation) => (
          <div 
            key={reservation.id}
            className="bg-white dark:bg-primary/50 rounded-xl p-6 shadow-sm space-y-4 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-primary dark:text-light">{reservation.name}</h3>
                <p className="text-sm text-primary/60 dark:text-light/60">{reservation.email}</p>
                <p className="text-sm text-primary/60 dark:text-light/60">{reservation.phone}</p>
              </div>
              <ReservationStatusBadge status={reservation.status} />
            </div>

            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-primary/60 dark:text-light/60">Fecha: </span>
                <span className="text-primary dark:text-light">
                  {format(new Date(reservation.date), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-primary/60 dark:text-light/60">Hora: </span>
                <span className="text-primary dark:text-light">{reservation.time}</span>
              </div>
              <div className="text-sm">
                <span className="text-primary/60 dark:text-light/60">Personas: </span>
                <span className="text-primary dark:text-light">
                  {reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}
                </span>
              </div>
            </div>

            {reservation.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
}