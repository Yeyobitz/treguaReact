import { useState } from 'react';
import { useConfigStore } from '../../stores/useConfigStore';
import { Save } from 'lucide-react';

export function AdminConfigPage() {
  const { config, updateConfig, loading, error } = useConfigStore();
  const [formData, setFormData] = useState({
    restaurantName: config.restaurantName || '',
    address: config.address || '',
    phone: config.phone || '',
    email: config.email || '',
    openingHours: config.openingHours || {
      lunch: {
        start: '12:30',
        end: '15:30',
        days: ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      },
      dinner: {
        start: '19:30',
        end: '23:30',
        days: ['Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      }
    },
    socialMedia: config.socialMedia || {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateConfig(formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif text-primary dark:text-light">Configuración General</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
              Nombre del Restaurante
            </label>
            <input
              type="text"
              value={formData.restaurantName}
              onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
              className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-serif text-primary dark:text-light">Redes Sociales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                }))}
                className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={formData.socialMedia.facebook}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
                className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                Twitter
              </label>
              <input
                type="url"
                value={formData.socialMedia.twitter}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                }))}
                className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}