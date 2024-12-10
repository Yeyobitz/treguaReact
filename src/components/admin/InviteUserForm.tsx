import { useState } from 'react';
import { X } from 'lucide-react';
import { createInvitation } from '../../services/invitations';
import { Role } from '../../types/auth';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface InviteUserFormProps {
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export function InviteUserForm({ onClose, onSuccess }: InviteUserFormProps) {
  const [role, setRole] = useState<Role>('crew');
  const [loading, setLoading] = useState(false);
  const { user } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const invitation = await createInvitation({
        role,
        createdBy: user.uid
      });
      onSuccess(invitation.code);
      onClose();
    } catch (error) {
      console.error('Error generating invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-light dark:bg-primary w-full max-w-md rounded-xl shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-primary dark:text-light">
              Generar Código de Invitación
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
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-lg border-neutral bg-light/50 dark:bg-primary/50"
                disabled={loading}
              >
                <option value="crew">Staff</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generando...' : 'Generar Código'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}