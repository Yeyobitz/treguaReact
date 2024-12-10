import { mockNotificationService } from './mockNotificationService';
import { emailTemplates } from './templates/emailTemplates';
import { adminTemplates } from './templates/adminTemplates';
import { Reservation, NotificationType } from '../../types/reservation';

export async function sendCustomerEmail(type: NotificationType, reservation: Reservation) {
  const template = emailTemplates[type](reservation);
  
  await mockNotificationService.sendEmail(
    reservation.email,
    template.subject,
    template.text
  );
}

export async function sendAdminEmail(reservation: Reservation) {
  const template = adminTemplates.email(reservation);
  
  await mockNotificationService.sendEmail(
    'admin@tregua.cl',
    template.subject,
    template.text
  );
}