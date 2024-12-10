import { create } from 'zustand';
import * as configService from '../services/config';

interface OpeningHours {
  start: string;
  end: string;
  days: string[];
}

interface Config {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    lunch: OpeningHours;
    dinner: OpeningHours;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

interface ConfigStore {
  config: Config;
  loading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  updateConfig: (data: Config) => Promise<void>;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  config: {
    restaurantName: '',
    address: '',
    phone: '',
    email: '',
    openingHours: {
      lunch: {
        start: '',
        end: '',
        days: []
      },
      dinner: {
        start: '',
        end: '',
        days: []
      }
    },
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  },
  loading: false,
  error: null,
  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const config = await configService.getConfig();
      set({ config, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar la configuración', loading: false });
    }
  },
  updateConfig: async (data) => {
    set({ loading: true, error: null });
    try {
      await configService.updateConfig(data);
      set({ config: data, loading: false });
    } catch (error) {
      set({ error: 'Error al actualizar la configuración', loading: false });
    }
  }
}));