import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as twilio from 'twilio';

admin.initializeApp();

const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

const TWILIO_PHONE_NUMBER = functions.config().twilio.phone_number;

export const sendSMS = functions.https.onRequest(async (request, response) => {
  try {
    // Verificar método
    if (request.method !== 'POST') {
      response.status(405).send('Method Not Allowed');
      return;
    }

    // Obtener datos del request
    const { to, message, type } = request.body;

    if (!to || !message || !type) {
      response.status(400).send('Missing required fields');
      return;
    }

    // Enviar SMS
    const result = await twilioClient.messages.create({
      body: message,
      to: to,
      from: TWILIO_PHONE_NUMBER
    });

    response.json({
      success: true,
      messageId: result.sid
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    response.status(500).json({
      success: false,
      error: error.message
    });
  }
});