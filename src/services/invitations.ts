import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  getFirestore
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { Role } from '../types/auth';

const db = getFirestore();

interface CreateInvitationParams {
  role: Role;
  createdBy: string;
}

export async function createInvitation({ role, createdBy }: CreateInvitationParams) {
  try {
    const code = nanoid(8);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const invitation = {
      code,
      role,
      createdBy,
      createdAt: serverTimestamp(),
      expiresAt: expiresAt.toISOString(),
      used: false
    };

    const docRef = await addDoc(collection(db, 'invitations'), invitation);
    
    return {
      id: docRef.id,
      ...invitation,
      createdAt: now.toISOString()
    };
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
}

export async function validateInvitation(code: string) {
  try {
    const q = query(
      collection(db, 'invitations'),
      where('code', '==', code),
      where('used', '==', false)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    // Check if invitation has expired
    if (new Date() > new Date(data.expiresAt)) return null;

    return {
      id: doc.id,
      ...data
    };
  } catch (error) {
    console.error('Error validating invitation:', error);
    return null;
  }
}

export async function markInvitationAsUsed(id: string) {
  try {
    const invitationRef = doc(db, 'invitations', id);
    await updateDoc(invitationRef, {
      used: true,
      usedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error marking invitation as used:', error);
    throw error;
  }
}