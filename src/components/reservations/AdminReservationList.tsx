import { useReservationStore } from '../../stores/useReservationStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReservationStatusBadge } from './ReservationStatusBadge';
import { Reservation } from '../../types/reservation';
import { Toast } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import { Users, Clock, Calendar as CalendarIcon, Mail, Phone, Trash2 } from 'lucide-react';
import { deleteReservation } from '../../services/reservations';
import { useState } from 'react';

interface AdminReservationListProps {
  reservations: Reservation[];
  userRole?: 'admin' | 'manager' | 'staff';
}

export function AdminReservationList({ reservations, userRole = 'staff' }: AdminReservationListProps) {
  const { updateReservationStatus, fetchReservations } = useReservationStore();
  const { toast, showToast, hideToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, status: Reservation['status']) => {
    try {
      await updateReservationStatus(id, status);
      showToast(
        status === 'confirmed' 
          ? 'Reserva confirmada exitosamente'
          : 'Reserva cancelada exitosamente',
        'success'
      );
    } catch (error) {
      showToast('Error al actualizar el estado de la reserva', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReservation(id);
      await fetchReservations();
      showToast('Reserva eliminada exitosamente', 'success');
      setShowDeleteConfirm(null);
    } catch (error) {
      showToast('Error al eliminar la reserva', 'error');
    }
  };

  const canDelete = userRole === 'admin' || userRole === 'manager';

  if (reservations.length === 0) {
    return (
      <div className="bg-light/50 dark:bg-primary/30 rounded-xl p-8 text-center">
        <p className="text-primary/60 dark:text-light/60">No hay reservas para mostrar</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <div 
            key={reservation.id}
            className="bg-light/50 dark:bg-primary/30 rounded-xl p-4 shadow-sm space-y-4 hover:bg-light/70 dark:hover:bg-primary/40 transition-colors"
          >
            {/* Header con nombre y estado */}
            <div className="flex items-start justify-between border-b border-neutral/10 dark:border-light/10 pb-3">
              <div>
                <h3 className="text-lg font-medium text-primary dark:text-light">{reservation.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-sm text-primary/60 dark:text-light/60">
                    <Mail className="w-4 h-4" />
                    <span>{reservation.email}</span>
                  </div>
                  <span className="text-primary/40 dark:text-light/40">•</span>
                  <div className="flex items-center gap-1 text-sm text-primary/60 dark:text-light/60">
                    <Phone className="w-4 h-4" />
                    <span>{reservation.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ReservationStatusBadge status={reservation.status} />
                {canDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(reservation.id)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Eliminar reserva"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteConfirm === reservation.id && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-primary/95 rounded-xl p-6 max-w-md mx-4">
                  <h3 className="text-lg font-medium text-primary dark:text-light mb-2">Confirmar eliminación</h3>
                  <p className="text-primary/60 dark:text-light/60 mb-4">
                    ¿Estás seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-primary dark:text-light hover:bg-primary/5 dark:hover:bg-light/5 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detalles de la reserva */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary/40 dark:text-light/40" />
                <div>
                  <p className="text-xs text-primary/60 dark:text-light/60">Fecha</p>
                  <p className="text-sm font-medium text-primary dark:text-light">
                    {(() => {
                      const [year, month, day] = reservation.date.split('-').map(Number);
                      const date = new Date(year, month - 1, day);
                      return format(date, "d 'de' MMMM, yyyy", { locale: es });
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary/40 dark:text-light/40" />
                <div>
                  <p className="text-xs text-primary/60 dark:text-light/60">Hora</p>
                  <p className="text-sm font-medium text-primary dark:text-light">
                    {reservation.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary/40 dark:text-light/40" />
                <div>
                  <p className="text-xs text-primary/60 dark:text-light/60">Personas</p>
                  <p className="text-sm font-medium text-primary dark:text-light">
                    {reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notas */}
            {reservation.notes && (
              <div className="text-sm text-primary/60 dark:text-light/60 bg-primary/5 dark:bg-light/5 rounded-lg p-3">
                <p className="font-medium text-primary/80 dark:text-light/80 mb-1">Notas:</p>
                <p>{reservation.notes}</p>
              </div>
            )}

            {/* Botones de acción */}
            {reservation.status === 'pending' && (
              <div className="flex gap-2 pt-2 border-t border-neutral/10 dark:border-light/10">
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