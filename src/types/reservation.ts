import { z } from 'zod';

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export const reservationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Formato de email inválido'),
  phone: z.string().regex(/^\+?[0-9]{9,}$/, 'Formato de teléfono inválido'),
  date: z.string().refine(
    (date) => new Date(date) > new Date(new Date().setHours(0, 0, 0, 0)),
    'No se pueden hacer reservas en fechas pasadas'
  ),
  time: z.string().min(1, 'La hora es requerida'),
  guests: z.number().min(1, 'El número de personas debe ser al menos 1'),
  notes: z.string().optional()
});

export interface CreateReservationDTO {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

export interface ReservationFormData extends CreateReservationDTO {}

export type ReservationStatus = Reservation['status'];