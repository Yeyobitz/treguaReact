import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Reservation } from '../../types/reservation';
import { NotificationType } from './types';

export async function sendNotification(type: NotificationType, reservation: Reservation) {
  await addDoc(collection(db, 'notifications'), {
    type,
    reservation,
    createdAt: new Date().toISOString(),
    status: 'pending'
  });
}

export * from './types';
export * from './emailTemplates';
export * from './smsTemplates';
export * from './adminTemplates';