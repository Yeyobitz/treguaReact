import { sendCustomerEmail, sendAdminEmail } from './emailService';
import { sendCustomerSMS, sendAdminSMS } from './smsService';
import { NotificationData } from './types';

export async function processNotification(notification: NotificationData) {
  const { type, reservation } = notification;

  try {
    // Send customer notifications
    await Promise.all([
      sendCustomerEmail(type, reservation),
      sendCustomerSMS(type, reservation)
    ]);

    // Send admin notifications for new reservations
    if (type === 'new') {
      await Promise.all([
        sendAdminEmail(reservation),
        sendAdminSMS(reservation)
      ]);
    }

    return { status: 'processed', processedAt: new Date().toISOString() };
  } catch (error) {
    console.error('Error processing notification:', error);
    return { 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      processedAt: new Date().toISOString()
    };
  }
}