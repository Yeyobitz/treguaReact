import { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { EditUserRole } from '../../components/admin/users/EditUserRole';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];

      setUsers(usersData);
    } catch (error) {
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-8">
        No tienes permisos para ver esta página
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Usuarios Registrados</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((userData) => (
              <tr key={userData.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {userData.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {userData.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${userData.role === 'admin' ? 'bg-red-100 text-red-800' : 
                      userData.role === 'customer' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {userData.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingUser(userData)}
                    className="text-accent hover:text-accent/80 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserRole
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
}