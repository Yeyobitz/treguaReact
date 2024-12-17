import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { renderHook, act } from '@testing-library/react';
import { getUserData } from '../../lib/auth';

// Mock getUserData
vi.mock('../../lib/auth', () => ({
  getUserData: vi.fn(),
  getUserRole: vi.fn()
}));

const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  role: 'user'
};

describe('Autenticación', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Configurar el mock de getUserData para devolver datos por defecto
    (getUserData as jest.Mock).mockResolvedValue(mockUser);
  });

  describe('Login', () => {
    it('debería iniciar sesión correctamente', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: { uid: 'test-uid' }
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const userData = await result.current.login('test@example.com', 'password123');
        expect(userData).toEqual(mockUser);
      });

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password123'
      );
    });

    it('debería manejar errores de login', async () => {
      const errorMessage = 'Usuario no autorizado';
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: { uid: 'test-uid' }
      });
      (getUserData as jest.Mock).mockResolvedValueOnce(null);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(
          result.current.login('test@example.com', 'wrongpassword')
        ).rejects.toThrow(errorMessage);
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('Registro', () => {
    it('debería registrar un nuevo usuario correctamente', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: { uid: 'test-uid' }
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        const userData = await result.current.register('newuser@example.com', 'password123');
        expect(userData).toEqual(mockUser);
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'newuser@example.com',
        'password123'
      );
    });

    it('debería manejar errores de registro', async () => {
      const errorMessage = 'Error al crear el usuario';
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
        user: { uid: 'test-uid' }
      });
      (getUserData as jest.Mock).mockResolvedValueOnce(null);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(
          result.current.register('existing@example.com', 'password123')
        ).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('Logout', () => {
    it('debería cerrar sesión correctamente', async () => {
      (signOut as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(signOut).toHaveBeenCalledWith(auth);
      expect(result.current.user).toBeNull();
    });

    it('debería manejar errores de logout', async () => {
      const errorMessage = 'Error during logout';
      (signOut as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(result.current.logout()).rejects.toThrow(errorMessage);
      });
    });
  });

  describe('Validaciones', () => {
    it('debería validar el formato del email', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(
          result.current.register('invalidemail', 'password123')
        ).rejects.toThrow('Email inválido');
      });
    });

    it('debería validar la longitud de la contraseña', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(
          result.current.register('test@example.com', '123')
        ).rejects.toThrow('La contraseña debe tener al menos 6 caracteres');
      });
    });
  });
}); 