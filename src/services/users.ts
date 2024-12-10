import { 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  updatePassword,
  deleteUser as deleteFirebaseUser,
  getAuth
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/auth';

const COLLECTION = 'users';

export async function getUsers() {
  try {
    const q = query(collection(db, COLLECTION), where('role', '!=', 'admin'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      email: doc.data().email,
      role: doc.data().role,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    })) as User[];
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Error al obtener usuarios');
  }
}

export async function createUser({ email, password, role }: CreateUserDTO) {
  try {
    // First create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;
    
    // Then create the user document in Firestore
    const userData = {
      email,
      role,
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, COLLECTION, uid), userData);

    return {
      uid,
      email,
      role,
      createdAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('El correo electrónico ya está en uso');
    }
    throw new Error('Error al crear usuario: ' + (error.message || 'Unknown error'));
  }
}

export async function updateUser(uid: string, { role, password }: UpdateUserDTO) {
  try {
    const userDoc = doc(db, COLLECTION, uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const updates: any = {
      role,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userDoc, updates);

    if (password) {
      const user = auth.currentUser;
      if (user && user.uid === uid) {
        await updatePassword(user, password);
      }
    }

    return {
      uid,
      ...userSnapshot.data(),
      ...updates,
      createdAt: userSnapshot.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Error al actualizar usuario');
  }
}

export async function deleteUser(uid: string) {
  try {
    // Delete from Firestore first
    const userDoc = doc(db, COLLECTION, uid);
    await deleteDoc(userDoc);
    
    // Then attempt to delete from Firebase Auth
    const adminAuth = getAuth();
    try {
      await adminAuth.deleteUser(uid);
    } catch (authError) {
      console.warn('User already deleted from Auth or not found:', authError);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error al eliminar usuario');
  }
}