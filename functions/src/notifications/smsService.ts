import * as functions from 'firebase-functions';
import * as twilio from 'twilio';
import { smsTemplates } from './templates/smsTemplates';
import { adminTemplates } from './templates/adminTemplates';
import { Reservation, NotificationType } from './types';

const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

const RESTAURANT_PHONE = process.env.RESTAURANT_PHONE;

export async function sendCustomerSMS(type: NotificationType, reservation: Reservation) {
  const message = smsTemplates[type](reservation);

  await twilioClient.messages.create({
    body: message,
    to: reservation.phone,
    from: RESTAURANT_PHONE
  });
}

export async function sendAdminSMS(reservation: Reservation) {
  const message = adminTemplates.sms(reservation);

  await twilioClient.messages.create({
    body: message,
    to: RESTAURANT_PHONE,
    from: RESTAURANT_PHONE
  });
}