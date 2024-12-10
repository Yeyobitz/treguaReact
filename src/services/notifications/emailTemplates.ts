import { Reservation } from '../../types/reservation';

export const emailTemplates = {
  new: (reservation: Reservation) => ({
    subject: 'Confirmación de reserva - Tregua',
    text: `
      Estimado/a ${reservation.name},
      
      Hemos recibido su reserva para ${reservation.guests} personas el día ${reservation.date} a las ${reservation.time}.
      
      Le confirmaremos su reserva a la brevedad.
      
      Saludos cordiales,
      Equipo Tregua
    `
  }),
  
  status_update: (reservation: Reservation) => ({
    subject: `Actualización de reserva - Tregua`,
    text: `
      Estimado/a ${reservation.name},
      
      Su reserva para el día ${reservation.date} a las ${reservation.time} ha sido ${
        reservation.status === 'confirmed' ? 'confirmada' : 'rechazada'
      }.
      
      ${reservation.status === 'confirmed' ? 
        'Le esperamos para disfrutar de una experiencia gastronómica única.' :
        'Lamentamos no poder atenderle en esta ocasión.'
      }
      
      Saludos cordiales,
      Equipo Tregua
    `
  }),
  
  cancellation: (reservation: Reservation) => ({
    subject: 'Cancelación de reserva - Tregua',
    text: `
      Estimado/a ${reservation.name},
      
      Su reserva para el día ${reservation.date} a las ${reservation.time} ha sido cancelada.
      
      Esperamos poder atenderle en otra ocasión.
      
      Saludos cordiales,
      Equipo Tregua
    `
  })
};