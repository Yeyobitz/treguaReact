import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { LoginFormData, SignupFormData } from '../types/auth';

export const authService = {
  async signup({ email, password, name }: SignupFormData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Crear el documento del usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        role: 'customer' // rol por defecto para usuarios normales
      });

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async login({ email, password }: LoginFormData) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener los datos adicionales del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }

      return {
        ...user,
        ...userDoc.data()
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}; 