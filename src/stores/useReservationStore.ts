import { create } from 'zustand';
import { Reservation } from '../types/reservation';
import * as reservationService from '../services/reservations';

interface ReservationStore {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  fetchReservations: () => Promise<void>;
  addReservation: (data: Omit<Reservation, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<void>;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  loading: false,
  error: null,
  fetchReservations: async () => {
    set({ loading: true, error: null });
    try {
      const reservations = await reservationService.getReservations();
      set({ reservations, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar las reservas', loading: false });
    }
  },
  addReservation: async (data) => {
    set({ loading: true, error: null });
    try {
      await reservationService.createReservation(data);
      const reservations = await reservationService.getReservations();
      set({ reservations, loading: false });
    } catch (error) {
      set({ error: 'Error al crear la reserva', loading: false });
    }
  },
  updateReservationStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      await reservationService.updateReservationStatus(id, status);
      const reservations = await reservationService.getReservations();
      set({ reservations, loading: false });
    } catch (error) {
      set({ error: 'Error al actualizar la reserva', loading: false });
    }
  },
}));