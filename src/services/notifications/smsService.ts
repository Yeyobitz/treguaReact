import { smsTemplates } from './smsTemplates';
import { Reservation } from '../../types/reservation';

type NotificationType = 'new' | 'status_update' | 'cancellation';

const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER;
const RESTAURANT_PHONE = import.meta.env.VITE_RESTAURANT_PHONE;

const base64Credentials = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

// Función para formatear números de teléfono
function formatPhoneNumber(phone: string): string {
  // Eliminar todos los caracteres no numéricos
  const numbers = phone.replace(/\D/g, '');
  
  // Si el número no tiene código de país y es de Chile (9 dígitos)
  if (numbers.length === 9) {
    return `+56${numbers}`;
  }
  
  // Si el número tiene 8 dígitos (número fijo de Chile)
  if (numbers.length === 8) {
    return `+562${numbers}`;
  }
  
  // Si ya tiene código de país (+56)
  if (numbers.startsWith('56') && numbers.length === 11) {
    return `+${numbers}`;
  }
  
  // Si ya tiene el + y código de país
  if (phone.startsWith('+') && numbers.length >= 11) {
    return phone;
  }
  
  // En cualquier otro caso, devolver el número como está
  return phone;
}

export const smsService = {
  async sendCustomerSMS(type: NotificationType, reservation: Reservation) {
    try {
      const message = smsTemplates[type](reservation);
      const formattedPhone = formatPhoneNumber(reservation.phone);
      
      console.log('Sending SMS to customer:', formattedPhone);
      
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: formattedPhone,
            From: TWILIO_PHONE_NUMBER,
            Body: message
          })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error sending SMS');
      }
      
      console.log('SMS sent successfully:', result);
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('Error sending customer SMS:', error);
      return { success: false, error };
    }
  },

  async sendAdminSMS(reservation: Reservation) {
    try {
      const message = `Nueva reserva recibida:\nFecha: ${reservation.date}\nHora: ${reservation.time}\nPersonas: ${reservation.guests}\nNombre: ${reservation.name}\nTeléfono: ${reservation.phone}`;
      const formattedPhone = formatPhoneNumber(RESTAURANT_PHONE);
      
      console.log('Sending SMS to admin:', formattedPhone);
      
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: formattedPhone,
            From: TWILIO_PHONE_NUMBER,
            Body: message
          })
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Error sending SMS');
      }
      
      console.log('Admin SMS sent successfully:', result);
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('Error sending admin SMS:', error);
      return { success: false, error };
    }
  }
};