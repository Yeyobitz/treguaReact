import { useState } from 'react';
import { X } from 'lucide-react';
import { User, Role } from '../../../types/auth';
import { useUserStore } from '../../../stores/useUserStore';
import { useToast } from '../../../hooks/useToast';

interface UserFormProps {
  user?: User;
  onClose: () => void;
}

interface UserFormData {
  email: string;
  password: string;
  role: Role;
}

const initialData: UserFormData = {
  email: '',
  password: '',
  role: 'crew'
};

export function UserForm({ user, onClose }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>(user ? {
    email: user.email,
    password: '',
    role: user.role
  } : initialData);
  
  const { addUser, updateUser } = useUserStore();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (user) {
        await updateUser(user.uid, {
          role: formData.role,
          ...(formData.password ? { password: formData.password } : {})
        });
        showToast('Usuario actualizado exitosamente');
      } else {
        if (!formData.password) {
          showToast('La contraseña es requerida', 'error');
          return;
        }
        await addUser({
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        showToast('Usuario creado exitosamente');
      }
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Error al procesar el usuario', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-light dark:bg-primary w-full max-w-md rounded-xl shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-primary dark:text-light">
              {user ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                Email
              </label>
              <input
                type="email"
                required={!user}
                disabled={!!user}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                {user ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              </label>
              <input
                type="password"
                required={!user}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary/80 dark:text-light/80 mb-1">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as Role }))}
                className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
              >
                <option value="crew">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
              >
                {user ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}