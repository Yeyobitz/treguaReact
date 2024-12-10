import { mockNotificationService } from './mockNotificationService';
import { smsTemplates } from './templates/smsTemplates';
import { adminTemplates } from './templates/adminTemplates';
import { Reservation, NotificationType } from '../../types/reservation';

export async function sendCustomerSMS(type: NotificationType, reservation: Reservation) {
  const message = smsTemplates[type](reservation);

  await mockNotificationService.sendSMS(
    reservation.phone,
    message
  );
}

export async function sendAdminSMS(reservation: Reservation) {
  const message = adminTemplates.sms(reservation);

  await mockNotificationService.sendSMS(
    '+56912345678', // Mock admin phone number
    message
  );
}