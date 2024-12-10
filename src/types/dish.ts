import { z } from 'zod';

export const dishSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  image: z.string().url('Debe ser una URL válida'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  featured: z.boolean().default(false),
  category: z.string().min(1, 'La categoría es requerida'),
  createdAt: z.string().optional()
});

export type Dish = z.infer<typeof dishSchema>;
export type CreateDishDTO = Omit<Dish, 'id' | 'createdAt'>;