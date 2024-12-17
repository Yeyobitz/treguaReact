import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminReservationList } from '../../components/reservations/AdminReservationList';
import { updateReservationStatus, deleteReservation } from '../../services/reservations';
import { vi } from 'vitest';

// Mock de los servicios
vi.mock('../../services/reservations', () => ({
  updateReservationStatus: vi.fn(),
  deleteReservation: vi.fn()
}));

const mockReservations = [
  {
    id: '1',
    name: 'Test User 1',
    email: 'test1@example.com',
    phone: '123456789',
    date: '2024-12-25',
    time: '20:00',
    guests: 4,
    status: 'pending',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Test User 2',
    email: 'test2@example.com',
    phone: '987654321',
    date: '2024-12-26',
    time: '21:00',
    guests: 2,
    status: 'confirmed',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

describe('AdminReservationList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar la lista de reservas', () => {
    render(<AdminReservationList reservations={mockReservations} />);

    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
  });

  it('debería mostrar mensaje cuando no hay reservas', () => {
    render(<AdminReservationList reservations={[]} />);

    expect(screen.getByText(/no hay reservas para mostrar/i)).toBeInTheDocument();
  });

  describe('Acciones de Reserva', () => {
    it('debería confirmar una reserva', async () => {
      (updateReservationStatus as jest.Mock).mockResolvedValueOnce({
        ...mockReservations[0],
        status: 'confirmed'
      });

      render(<AdminReservationList reservations={[mockReservations[0]]} />);

      const confirmButton = screen.getByText(/confirmar/i);
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(updateReservationStatus).toHaveBeenCalledWith('1', 'confirmed');
        expect(screen.getByText(/reserva confirmada exitosamente/i)).toBeInTheDocument();
      });
    });

    it('debería cancelar una reserva', async () => {
      (updateReservationStatus as jest.Mock).mockResolvedValueOnce({
        ...mockReservations[0],
        status: 'cancelled'
      });

      render(<AdminReservationList reservations={[mockReservations[0]]} />);

      const cancelButton = screen.getByText(/cancelar/i);
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(updateReservationStatus).toHaveBeenCalledWith('1', 'cancelled');
        expect(screen.getByText(/reserva cancelada exitosamente/i)).toBeInTheDocument();
      });
    });

    it('debería eliminar una reserva (solo admin/manager)', async () => {
      (deleteReservation as jest.Mock).mockResolvedValueOnce(true);

      render(<AdminReservationList 
        reservations={[mockReservations[0]]} 
        userRole="admin"
      />);

      // Buscar y hacer clic en el botón de eliminar
      const deleteButton = screen.getByTitle(/eliminar reserva/i);
      fireEvent.click(deleteButton);

      // Confirmar la eliminación
      const confirmButton = screen.getByText(/eliminar$/i);
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(deleteReservation).toHaveBeenCalledWith('1');
        expect(screen.getByText(/reserva eliminada exitosamente/i)).toBeInTheDocument();
      });
    });

    it('no debería mostrar botón de eliminar para staff', () => {
      render(<AdminReservationList 
        reservations={[mockReservations[0]]} 
        userRole="staff"
      />);

      expect(screen.queryByTitle(/eliminar reserva/i)).not.toBeInTheDocument();
    });
  });

  describe('Manejo de Errores', () => {
    it('debería manejar error al confirmar reserva', async () => {
      const error = new Error('Error al actualizar el estado de la reserva');
      (updateReservationStatus as jest.Mock).mockRejectedValueOnce(error);

      render(<AdminReservationList reservations={[mockReservations[0]]} />);

      const confirmButton = screen.getByText(/confirmar/i);
      await userEvent.click(confirmButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/error al actualizar el estado de la reserva/i);
        expect(errorMessage).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('debería manejar error al eliminar reserva', async () => {
      const error = new Error('Error al eliminar la reserva');
      (deleteReservation as jest.Mock).mockRejectedValueOnce(error);

      render(<AdminReservationList 
        reservations={[mockReservations[0]]} 
        userRole="admin"
      />);

      // Buscar y hacer clic en el botón de eliminar
      const deleteButton = screen.getByTitle(/eliminar reserva/i);
      await userEvent.click(deleteButton);

      // Confirmar la eliminación
      const confirmButton = screen.getByText(/eliminar$/i);
      await userEvent.click(confirmButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/error al eliminar la reserva/i);
        expect(errorMessage).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Filtros y Ordenamiento', () => {
    it('debería mostrar las reservas en orden cronológico', () => {
      render(<AdminReservationList reservations={mockReservations} />);

      const dates = screen.getAllByText(/\d{1,2} de \w+, \d{4}/);
      expect(dates[0]).toHaveTextContent('25 de diciembre, 2024');
      expect(dates[1]).toHaveTextContent('26 de diciembre, 2024');
    });

    it('debería mostrar el estado correcto de cada reserva', () => {
      render(<AdminReservationList reservations={mockReservations} />);

      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('Confirmada')).toBeInTheDocument();
    });
  });
}); 