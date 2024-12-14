import { Reservation } from '../../types/reservation';

export const smsTemplates = {
  new: (reservation: Reservation) => 
    `Tregua: Hemos recibido su reserva para el ${reservation.date} a las ${reservation.time}. Le confirmaremos a la brevedad.`,
  
  status_update: (reservation: Reservation) => 
    `Tregua: Su reserva para el ${reservation.date} ha sido ${reservation.status === 'confirmed' ? 'confirmada' : 'rechazada'}.\n\nDetalles de su reserva:\n- Fecha: ${reservation.date}\n- Hora: ${reservation.time}\n- Personas: ${reservation.guests}\n- Nombre: ${reservation.name}\n- Telefono: ${reservation.phone}${reservation.notes ? `\n- Notas: ${reservation.notes}` : ''}`,
  
  cancellation: (reservation: Reservation) => 
    `Tregua: Su reserva para el ${reservation.date} ha sido cancelada. Esperamos atenderle en otra ocasión.`
};