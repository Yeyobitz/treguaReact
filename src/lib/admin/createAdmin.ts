import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase';

export async function createAdminUser(email: string, password: string) {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Create admin document in Firestore
    const db = getFirestore();
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error: any) {
    console.error('Error creating admin:', error);
    throw new Error(error.message);
  }
}