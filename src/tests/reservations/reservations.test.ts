import { vi, describe, it, expect, beforeEach } from 'vitest';
import { addDoc, getDoc, getDocs, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { createReservation, getReservations, updateReservationStatus, deleteReservation } from '../../services/reservations';
import { smsService } from '../../services/notifications/smsService';
import { sendCustomerEmail, sendAdminEmail } from '../../services/notifications/emailService';

const mockReservation = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '123456789',
  date: '2024-12-25',
  time: '20:00',
  guests: 4,
  notes: 'Test notes'
};

const mockReservationResponse = {
  id: 'test-id',
  ...mockReservation,
  status: 'pending',
  createdAt: '2024-01-01T00:00:00.000Z'
};

describe('Sistema de Reservas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Crear Reserva', () => {
    it('debería crear una reserva correctamente', async () => {
      (addDoc as jest.Mock).mockResolvedValueOnce({ id: 'test-id' });
      (collection as jest.Mock).mockReturnValue({});
      
      const result = await createReservation(mockReservation);

      expect(addDoc).toHaveBeenCalled();
      expect(result).toBe('test-id');
      expect(smsService.sendCustomerSMS).toHaveBeenCalled();
      expect(smsService.sendAdminSMS).toHaveBeenCalled();
      expect(sendCustomerEmail).toHaveBeenCalled();
      expect(sendAdminEmail).toHaveBeenCalled();
    });

    it('debería validar los datos de la reserva', async () => {
      const invalidReservation = {
        ...mockReservation,
        date: 'invalid-date'
      };

      await expect(createReservation(invalidReservation)).rejects.toThrow();
    });

    it('debería manejar errores al crear la reserva', async () => {
      (addDoc as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(createReservation(mockReservation)).rejects.toThrow('Error al crear la reserva');
    });
  });

  describe('Obtener Reservas', () => {
    it('debería obtener todas las reservas', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ ...mockReservationResponse }) },
        { id: '2', data: () => ({ ...mockReservationResponse }) }
      ];

      (getDocs as jest.Mock).mockResolvedValueOnce({ docs: mockDocs });
      (query as jest.Mock).mockReturnValue({});
      (collection as jest.Mock).mockReturnValue({});
      (orderBy as jest.Mock).mockReturnValue({});

      const reservations = await getReservations();

      expect(reservations).toHaveLength(2);
      expect(getDocs).toHaveBeenCalled();
    });

    it('debería manejar errores al obtener reservas', async () => {
      (getDocs as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await expect(getReservations()).rejects.toThrow('Error al obtener las reservas');
    });
  });

  describe('Actualizar Estado de Reserva', () => {
    it('debería actualizar el estado correctamente', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => mockReservationResponse
      });
      (updateDoc as jest.Mock).mockResolvedValueOnce({});

      const result = await updateReservationStatus('test-id', 'confirmed');

      expect(updateDoc).toHaveBeenCalled();
      expect(result.status).toBe('confirmed');
      expect(smsService.sendCustomerSMS).toHaveBeenCalled();
      expect(sendCustomerEmail).toHaveBeenCalled();
    });

    it('debería manejar reservas no existentes', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => false
      });

      await expect(updateReservationStatus('invalid-id', 'confirmed'))
        .rejects.toThrow('Reservation not found');
    });
  });

  describe('Eliminar Reserva', () => {
    it('debería eliminar una reserva correctamente', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true
      });
      (deleteDoc as jest.Mock).mockResolvedValueOnce({});

      const result = await deleteReservation('test-id');

      expect(deleteDoc).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('debería manejar errores al eliminar', async () => {
      (getDoc as jest.Mock).mockResolvedValueOnce({
        exists: () => true
      });
      (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error('Delete error'));

      await expect(deleteReservation('test-id'))
        .rejects.toThrow('Error al eliminar la reserva');
    });
  });

  describe('Validaciones de Negocio', () => {
    it('no debería permitir reservas en el pasado', async () => {
      const pastReservation = {
        ...mockReservation,
        date: '2020-01-01'
      };

      await expect(createReservation(pastReservation))
        .rejects.toThrow('No se pueden hacer reservas en fechas pasadas');
    });

    it('debería validar el número de personas', async () => {
      const invalidGuestsReservation = {
        ...mockReservation,
        guests: 0
      };

      await expect(createReservation(invalidGuestsReservation))
        .rejects.toThrow('El número de personas debe ser mayor a 0');
    });

    it('debería validar el formato del teléfono', async () => {
      const invalidPhoneReservation = {
        ...mockReservation,
        phone: '123'
      };

      await expect(createReservation(invalidPhoneReservation))
        .rejects.toThrow('Formato de teléfono inválido');
    });

    it('debería validar el horario de reserva', async () => {
      const invalidTimeReservation = {
        ...mockReservation,
        time: '03:00'
      };

      await expect(createReservation(invalidTimeReservation))
        .rejects.toThrow('Horario de reserva no disponible');
    });
  });
}); 