import { sendCustomerEmail, sendAdminEmail } from './emailService';
import { sendCustomerSMS, sendAdminSMS } from './smsService';
import { NotificationData } from './types';

export async function processNotification(notification: NotificationData) {
  const { type, reservation } = notification;
  
  console.log('Starting notification process with:', { type, reservation });

  try {
    // Send customer notifications in parallel
    const emailPromise = sendCustomerEmail(type, reservation)
      .then(() => console.log('Email sent successfully'))
      .catch(error => console.error('Email specific error:', error));
      
    const smsPromise = sendCustomerSMS(type, reservation)
      .then(() => console.log('SMS sent successfully'))
      .catch(error => console.error('SMS specific error:', error));

    await Promise.all([emailPromise, smsPromise]);

    // Send admin notifications for new reservations
    if (type === 'new') {
      console.log('Sending admin notifications...');
      await Promise.all([
        sendAdminEmail(reservation)
          .then(() => console.log('Admin email sent successfully'))
          .catch(error => console.error('Admin email error:', error)),
        sendAdminSMS(reservation)
          .then(() => console.log('Admin SMS sent successfully'))
          .catch(error => console.error('Admin SMS error:', error))
      ]);
    }

    return { 
      status: 'processed', 
      processedAt: new Date().toISOString() 
    };
  } catch (error) {
    console.error('Error in notification processor:', error);
    return { 
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      processedAt: new Date().toISOString()
    };
  }
}