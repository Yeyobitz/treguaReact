import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserRole } from '../lib/admin/roles';
import { Role } from '../types/auth';

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRole = await getUserRole(firebaseUser);
          if (userRole) {
            setUser(firebaseUser);
            setRole(userRole);
            setError(null);
          } else {
            await auth.signOut();
            setUser(null);
            setRole(null);
            setError('Usuario no autorizado');
          }
        } else {
          setUser(null);
          setRole(null);
          setError(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setUser(null);
        setRole(null);
        setError('Error de autenticación');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    role,
    loading,
    error,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isCrew: role === 'crew',
    canManageUsers: role === 'admin' || role === 'manager',
    canManageInvitations: role === 'admin' || role === 'manager'
  };
}