import { z } from 'zod';

export const reservationSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Formato de teléfono inválido'),
  date: z.string().or(z.date()),
  time: z.string(),
  guests: z.number().min(1, 'El número de personas debe ser mayor a 0'),
  comments: z.string().optional(),
});

export type ReservationType = z.infer<typeof reservationSchema>; 