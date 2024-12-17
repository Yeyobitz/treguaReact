import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReservationForm } from '../../components/reservations/ReservationForm';
import { createReservation } from '../../services/reservations';
import { vi } from 'vitest';

// Mock del servicio de reservas
vi.mock('../../services/reservations', () => ({
  createReservation: vi.fn()
}));

describe('ReservationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar todos los campos del formulario', () => {
    render(<ReservationForm />);

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hora/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de personas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notas adicionales/i)).toBeInTheDocument();
  });

  it('debería mostrar errores de validación', async () => {
    render(<ReservationForm />);
    
    const submitButton = screen.getByText(/confirmar reserva/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/por favor, corrige los errores en el formulario/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('debería enviar el formulario correctamente', async () => {
    (createReservation as jest.Mock).mockResolvedValueOnce('test-id');

    render(<ReservationForm />);

    // Llenar el formulario
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '123456789');
    
    const dateInput = screen.getByLabelText(/fecha/i);
    await userEvent.type(dateInput, '2024-12-25');
    
    const timeSelect = screen.getByLabelText(/hora/i);
    await userEvent.selectOptions(timeSelect, '20:00');
    
    const guestsSelect = screen.getByLabelText(/número de personas/i);
    await userEvent.selectOptions(guestsSelect, '4');
    
    await userEvent.type(screen.getByLabelText(/notas adicionales/i), 'Test notes');

    // Enviar formulario
    const submitButton = screen.getByText(/confirmar reserva/i);
    await userEvent.click(submitButton);

    // Esperar a que aparezca el mensaje de éxito
    await waitFor(() => {
      const successMessage = screen.getByText(/¡reserva realizada con éxito!/i);
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('debería manejar errores al enviar el formulario', async () => {
    const error = new Error('Error al realizar la reserva');
    (createReservation as jest.Mock).mockRejectedValueOnce(error);

    render(<ReservationForm />);

    // Llenar el formulario con datos válidos
    await userEvent.type(screen.getByLabelText(/nombre completo/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/teléfono/i), '123456789');
    
    const dateInput = screen.getByLabelText(/fecha/i);
    await userEvent.type(dateInput, '2024-12-25');
    
    const timeSelect = screen.getByLabelText(/hora/i);
    await userEvent.selectOptions(timeSelect, '20:00');
    
    const guestsSelect = screen.getByLabelText(/número de personas/i);
    await userEvent.selectOptions(guestsSelect, '4');

    // Enviar formulario
    const submitButton = screen.getByText(/confirmar reserva/i);
    await userEvent.click(submitButton);

    // Esperar a que aparezca el mensaje de error
    await waitFor(() => {
      const errorMessage = screen.getByText(/error al realizar la reserva/i);
      expect(errorMessage).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  describe('Validaciones de Campo', () => {
    it('debería validar el formato del email', async () => {
      render(<ReservationForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.tab();

      expect(screen.getByText(/formato de email inválido/i)).toBeInTheDocument();
    });

    it('debería validar el formato del teléfono', async () => {
      render(<ReservationForm />);
      
      const phoneInput = screen.getByLabelText(/teléfono/i);
      await userEvent.type(phoneInput, '123');
      await userEvent.tab();

      expect(screen.getByText(/formato de teléfono inválido/i)).toBeInTheDocument();
    });

    it('no debería permitir fechas en el pasado', async () => {
      render(<ReservationForm />);
      
      const dateInput = screen.getByLabelText(/fecha/i);
      await userEvent.type(dateInput, '2020-01-01');
      await userEvent.tab();

      expect(screen.getByText(/no se pueden hacer reservas en fechas pasadas/i)).toBeInTheDocument();
    });
  });
}); 