import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { User, Role } from '../types/auth';

export async function getUserRole(user: FirebaseUser): Promise<Role | null> {
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.warn(`No user document found for uid: ${user.uid}`);
      return null;
    }
    
    return userDoc.data().role as Role;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}

export async function getUserData(user: FirebaseUser): Promise<User | null> {
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.warn(`No user document found for uid: ${user.uid}`);
      return null;
    }
    
    const data = userDoc.data();
    return {
      uid: user.uid,
      email: user.email!,
      role: data.role,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}