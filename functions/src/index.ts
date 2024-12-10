import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { processNotification } from './notifications/notificationProcessor';

admin.initializeApp();

export const handleNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    const result = await processNotification(notification);
    await snap.ref.update(result);
  });