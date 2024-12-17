import emailjs from '@emailjs/browser';
import { Reservation } from '../../types/reservation';
import { emailTemplates } from './emailTemplates';
import { NotificationType } from './types';
import { adminTemplates } from './adminTemplates';

const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAIL_SERVICE_ID_2 = import.meta.env.VITE_EMAILJS_SERVICE_ID_2;
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const PUBLIC_KEY_2 = import.meta.env.VITE_EMAILJS_PUBLIC_KEY_2;
const CANCEL_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CANCEL_TEMPLATE_ID;
const STATUS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_STATUS_TEMPLATE_ID;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;

export async function sendCustomerEmail(type: NotificationType, reservation: Reservation) {
  console.log('Email service received:', { type, reservation });
  const template = emailTemplates[type](reservation);
  
  const templateData = {
    to_name: reservation.name,
    to_email: reservation.email,
    message_html: type === 'new' ? template.html : undefined,
    status_update_html: type === 'status_update' ? template.html : undefined,
    cancellation_html: type === 'cancellation' ? template.html : undefined,
    from_name: "Tregua Restaurant",
    reply_to: "tregua.restaurant@gmail.com"
  };
  console.log('Sending email with data:', templateData);

  try {
    const response = await emailjs.send(
      type === 'cancellation' ? EMAIL_SERVICE_ID_2 : EMAIL_SERVICE_ID,
      type === 'cancellation' ? CANCEL_TEMPLATE_ID : 
      type === 'status_update' ? STATUS_TEMPLATE_ID : 
      EMAIL_TEMPLATE_ID,
      templateData,
      type === 'cancellation' ? PUBLIC_KEY_2 : PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

export async function sendAdminEmail(reservation: Reservation) {
  console.log('Starting admin email send...');
  const template = adminTemplates.email(reservation);
  
  const templateData = {
    to_email: 'tregua.restaurant@gmail.com',
    admin_html: template.html,
    from_name: "Sistema de Reservas Tregua"
  };
  console.log('Admin email template data:', templateData);

  try {
    const response = await emailjs.send(
      EMAIL_SERVICE_ID_2,  // Changed to second account's service ID
      ADMIN_TEMPLATE_ID,
      templateData,
      PUBLIC_KEY_2    // Changed to second account's public key
    );
    console.log('Admin email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Admin email sending failed:', error);
    throw error;
  }
}