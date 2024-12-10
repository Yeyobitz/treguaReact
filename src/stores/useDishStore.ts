import { create } from 'zustand';
import { Dish, CreateDishDTO } from '../types/dish';
import * as dishService from '../services/dishes';

interface DishStore {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
  fetchDishes: () => Promise<void>;
  addDish: (data: CreateDishDTO) => Promise<void>;
  updateDish: (id: string, data: Partial<CreateDishDTO>) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
}

export const useDishStore = create<DishStore>((set, get) => ({
  dishes: [],
  loading: false,
  error: null,
  fetchDishes: async () => {
    set({ loading: true, error: null });
    try {
      const dishes = await dishService.getDishes();
      set({ dishes, loading: false });
    } catch (error) {
      console.error('Error fetching dishes:', error);
      set({ error: 'Error al cargar los platos', loading: false });
    }
  },
  addDish: async (data) => {
    set({ loading: true, error: null });
    try {
      await dishService.createDish(data);
      await get().fetchDishes();
    } catch (error) {
      console.error('Error adding dish:', error);
      set({ error: 'Error al crear el plato', loading: false });
    }
  },
  updateDish: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await dishService.updateDish(id, data);
      await get().fetchDishes();
    } catch (error) {
      console.error('Error updating dish:', error);
      set({ error: 'Error al actualizar el plato', loading: false });
    }
  },
  deleteDish: async (id) => {
    set({ loading: true, error: null });
    try {
      await dishService.deleteDish(id);
      await get().fetchDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
      set({ error: 'Error al eliminar el plato', loading: false });
    }
  }
}));