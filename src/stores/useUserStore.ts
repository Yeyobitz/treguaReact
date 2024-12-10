import { create } from 'zustand';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/auth';
import * as userService from '../services/users';

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (data: CreateUserDTO) => Promise<void>;
  updateUser: (id: string, data: UpdateUserDTO) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await userService.getUsers();
      set({ users, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ error: 'Error al cargar los usuarios', loading: false });
    }
  },
  addUser: async (data) => {
    set({ loading: true, error: null });
    try {
      await userService.createUser(data);
      await get().fetchUsers();
      set({ loading: false });
    } catch (error) {
      console.error('Error adding user:', error);
      set({ error: 'Error al crear el usuario', loading: false });
      throw error;
    }
  },
  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await userService.updateUser(id, data);
      await get().fetchUsers();
      set({ loading: false });
    } catch (error) {
      console.error('Error updating user:', error);
      set({ error: 'Error al actualizar el usuario', loading: false });
      throw error;
    }
  },
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(id);
      await get().fetchUsers();
      set({ loading: false });
    } catch (error) {
      console.error('Error deleting user:', error);
      set({ error: 'Error al eliminar el usuario', loading: false });
      throw error;
    }
  }
}));