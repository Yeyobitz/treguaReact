import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';
import { emailTemplates } from './templates/emailTemplates';
import { adminTemplates } from './templates/adminTemplates';
import { Reservation, NotificationType } from './types';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

export async function sendCustomerEmail(type: NotificationType, reservation: Reservation) {
  const template = emailTemplates[type](reservation);
  
  await transporter.sendMail({
    from: '"Tregua Restaurant" <reservas@tregua.cl>',
    to: reservation.email,
    subject: template.subject,
    text: template.text
  });
}

export async function sendAdminEmail(reservation: Reservation) {
  const template = adminTemplates.email(reservation);
  
  await transporter.sendMail({
    from: '"Sistema de Reservas" <reservas@tregua.cl>',
    to: process.env.ADMIN_EMAIL,
    subject: template.subject,
    text: template.text
  });
}