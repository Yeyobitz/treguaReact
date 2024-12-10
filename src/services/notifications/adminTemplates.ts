import { Reservation } from '../../types/reservation';

export const adminTemplates = {
  email: (reservation: Reservation) => ({
    subject: 'Nueva reserva recibida - Tregua',
    text: `
      Nueva reserva recibida:
      
      Nombre: ${reservation.name}
      Email: ${reservation.email}
      Teléfono: ${reservation.phone}
      Fecha: ${reservation.date}
      Hora: ${reservation.time}
      Personas: ${reservation.guests}
      Notas: ${reservation.notes || 'Sin notas'}
    `
  }),
  
  sms: (reservation: Reservation) => 
    `Tregua: Nueva reserva de ${reservation.name} para ${reservation.guests} personas el ${reservation.date} a las ${reservation.time}`
};