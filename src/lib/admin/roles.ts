import { User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { Role } from '../../types/auth';

export async function getUserRole(user: User): Promise<Role | null> {
  if (!user) return null;

  try {
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) return null;
    
    return userDoc.data().role as Role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

export function isAdmin(role: Role | null): boolean {
  return role === 'admin';
}

export function isManager(role: Role | null): boolean {
  return role === 'manager';
}

export function isCrew(role: Role | null): boolean {
  return role === 'crew';
}

export function canManageUsers(role: Role | null): boolean {
  return isAdmin(role) || isManager(role);
}

export function canManageInvitations(role: Role | null): boolean {
  return isAdmin(role) || isManager(role);
}