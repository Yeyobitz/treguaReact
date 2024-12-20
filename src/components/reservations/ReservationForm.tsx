import { ReservationFormFields } from './ReservationFormFields';
import { useReservationForm } from '../../hooks/useReservationForm';
import { Toast } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';

export function ReservationForm() {
  const { formData, errors, handleChange, handleSubmit: submitReservation } = useReservationForm();
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitReservation(e);
      showToast('¡Reserva realizada con éxito! Te enviaremos un correo de confirmación.', 'success');
    } catch (error: any) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        if (errorMessage === 'Error de validación') {
          showToast('Por favor, corrige los errores en el formulario.', 'error');
        } else if (
          errorMessage === 'No se pueden hacer reservas en fechas pasadas' ||
          errorMessage === 'Horario de reserva no disponible' ||
          errorMessage === 'El número de personas debe ser mayor a 0' ||
          errorMessage === 'Formato de teléfono inválido'
        ) {
          showToast(errorMessage, 'error');
        } else if (errorMessage === 'Error al crear la reserva') {
          showToast('Error al realizar la reserva', 'error');
        } else {
          showToast('Error al realizar la reserva', 'error');
        }
      } else {
        showToast('Error al realizar la reserva', 'error');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto" noValidate>
        <ReservationFormFields 
          formData={formData}
          errors={errors}
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
          data-testid="toast-message"
        />
      )}
    </>
  );
}