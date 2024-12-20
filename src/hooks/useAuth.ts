import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserRole, getUserData } from '../lib/auth';
import { User, Role } from '../types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userData = await getUserData(firebaseUser);
          if (userData) {
            setUser(userData);
            setRole(userData.role);
            setError(null);
          } else {
            await signOut(auth);
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validar email
      if (!email.includes('@')) {
        throw new Error('Email inválido');
      }

      // Validar contraseña
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = await getUserData(userCredential.user);

      if (!userData) {
        throw new Error('Error al crear el usuario');
      }

      return userData;
    } catch (err) {
      console.error('Register error:', err);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      setError('Error en el registro');
      throw new Error('Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserData(userCredential.user);
      
      if (!userData) {
        throw new Error('Usuario no autorizado');
      }
      
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      setError('Error de inicio de sesión');
      throw new Error('Error de inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      setError('Error al cerrar sesión');
      throw new Error('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    role,
    loading,
    error,
    login,
    logout,
    register,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isCrew: role === 'crew',
  };
}