import { useState } from 'react';
import { User } from '../../../types/auth';
import { UserForm } from './UserForm';
import { Edit, Trash2 } from 'lucide-react';
import { useUserStore } from '../../../stores/useUserStore';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../hooks/useAuth';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { deleteUser } = useUserStore();
  const { showToast } = useToast();
  const { role } = useAuth();

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await deleteUser(id);
        showToast('Usuario eliminado exitosamente');
      } catch (error) {
        showToast('Error al eliminar el usuario', 'error');
      }
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-primary/60 dark:text-light/60">
        No hay usuarios para mostrar
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.uid}
          className="bg-white dark:bg-primary/50 rounded-xl shadow-sm overflow-hidden transition-colors"
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-primary dark:text-light">
                  {user.email}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                  user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {user.role}
                </span>
              </div>
              {role === 'admin' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="p-2 text-primary/60 dark:text-light/60 hover:text-primary dark:hover:text-light transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.uid)}
                    className="p-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-primary/60 dark:text-light/60">
              Creado el: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}

      {editingUser && (
        <UserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}