import { useState } from 'react';
import { Plus } from 'lucide-react';
import { InviteUserForm } from '../../components/admin/users/InviteUserForm';
import { useAuth } from '../../hooks/useAuth';
import { Toast } from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

export function AdminUsersPage() {
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
  const { role } = useAuth();
  const { toast, hideToast } = useToast();

  if (!role || (role !== 'admin' && role !== 'manager')) {
    return (
      <div className="text-center py-8 text-primary/60 dark:text-light/60">
        No tienes permisos para acceder a esta página.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-primary dark:text-light">Gestión de Usuarios</h1>
        <button
          onClick={() => setIsInviteFormOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear código invitación
        </button>
      </div>

      {isInviteFormOpen && (
        <InviteUserForm onClose={() => setIsInviteFormOpen(false)} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}