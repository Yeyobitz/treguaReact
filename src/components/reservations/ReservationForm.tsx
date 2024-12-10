import { ReservationFormFields } from './ReservationFormFields';
import { useReservationForm } from '../../hooks/useReservationForm';
import { Toast } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';

export function ReservationForm() {
  const { formData, handleChange, handleSubmit: submitReservation } = useReservationForm();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReservation(e);
      showToast('¡Reserva realizada con éxito! Te enviaremos un correo de confirmación.');
    } catch (error) {
      showToast('Error al realizar la reserva. Por favor, intenta nuevamente.', 'error');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <ReservationFormFields 
          formData={formData}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-accent text-light px-8 py-3 rounded-full hover:bg-accent/90 transition-colors text-sm tracking-wide"
        >
          Confirmar reserva
        </button>
      </form>

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