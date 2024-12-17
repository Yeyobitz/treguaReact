import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReservationStore } from '../stores/useReservationStore';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Users, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { cancelReservation } from '../services/reservations';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reservationId: string;
}

function CancelModal({ isOpen, onClose, onConfirm, reservationId }: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-primary dark:text-light">
            Cancelar Reserva #{reservationId.slice(-4)}
          </h3>
          <button
            onClick={onClose}
            className="text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-primary/80 dark:text-light/80 mb-6">
          ¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-primary/80 dark:text-light/80 hover:text-primary dark:hover:text-light"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Cancelar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const { reservations, fetchReservations } = useReservationStore();
  const { showToast } = useToast();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancelClick = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReservation) return;
    
    setLoading(true);
    try {
      await cancelReservation(selectedReservation);
      await fetchReservations();
      showToast('Reserva cancelada exitosamente', 'success');
    } catch (error) {
      showToast('Error al cancelar la reserva', 'error');
    } finally {
      setLoading(false);
      setCancelModalOpen(false);
      setSelectedReservation(null);
    }
  };

  // Filtrar reservas del usuario actual
  const userReservations = reservations.filter(
    reservation => reservation.email === user?.email
  );

  return (
    <div className="min-h-screen bg-light dark:bg-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Perfil del Usuario */}
        <div className="bg-white dark:bg-primary/50 rounded-xl p-8 shadow-lg mb-8">
          <h1 className="text-3xl font-serif text-primary dark:text-light mb-6">
            Mi Perfil
          </h1>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-primary/60 dark:text-light/60">Nombre</p>
              <p className="text-lg text-primary dark:text-light">{user?.name || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-primary/60 dark:text-light/60">Email</p>
              <p className="text-lg text-primary dark:text-light">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Mis Reservas */}
        <div className="bg-white dark:bg-primary/50 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-serif text-primary dark:text-light mb-6">
            Mis Reservas
          </h2>
          
          {userReservations.length === 0 ? (
            <p className="text-primary/60 dark:text-light/60 text-center py-8">
              No tienes reservas activas
            </p>
          ) : (
            <div className="space-y-6">
              {userReservations.map((reservation) => (
                <div 
                  key={reservation.id}
                  className="bg-light/50 dark:bg-primary/30 rounded-xl p-6 space-y-4"
                >
                  {/* Estado de la reserva */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-primary dark:text-light">
                      Reserva #{reservation.id.slice(-4)}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : reservation.status === 'cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }
                      `}>
                        {reservation.status === 'confirmed' ? 'Confirmada'
                          : reservation.status === 'cancelled' ? 'Cancelada'
                          : 'Pendiente'
                        }
                      </span>
                      {reservation.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelClick(reservation.id)}
                          disabled={loading}
                          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detalles de la reserva */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary/40 dark:text-light/40" />
                      <div>
                        <p className="text-sm text-primary/60 dark:text-light/60">Fecha</p>
                        <p className="text-primary dark:text-light">
                          {format(parseISO(reservation.date), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary/40 dark:text-light/40" />
                      <div>
                        <p className="text-sm text-primary/60 dark:text-light/60">Hora</p>
                        <p className="text-primary dark:text-light">{reservation.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary/40 dark:text-light/40" />
                      <div>
                        <p className="text-sm text-primary/60 dark:text-light/60">Personas</p>
                        <p className="text-primary dark:text-light">
                          {reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  {reservation.comments && (
                    <div className="text-sm text-primary/60 dark:text-light/60 bg-primary/5 dark:bg-light/5 rounded-lg p-3">
                      <p className="font-medium text-primary/80 dark:text-light/80 mb-1">Notas:</p>
                      <p>{reservation.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedReservation(null);
        }}
        onConfirm={handleCancelConfirm}
        reservationId={selectedReservation || ''}
      />
    </div>
  );
}

export default ProfilePage; 