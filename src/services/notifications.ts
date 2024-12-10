import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { Reservation } from '../types/reservation';

export async function sendNotification(type: 'new' | 'status_update' | 'cancellation', reservation: Reservation) {
  await addDoc(collection(db, 'notifications'), {
    type,
    reservation,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
}