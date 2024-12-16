import { Reservation } from '../../types/reservation';

export const emailTemplates = {
  new: (reservation: Reservation) => ({
    subject: 'Confirmación de Reserva - Tregua Restaurant',
    html: `
      <div>
        <h2>Tregua Restaurant</h2>
        <p>Estimado/a ${reservation.name},</p>
        <p>Hemos recibido su reserva para ${reservation.guests} personas el día ${reservation.date} a las ${reservation.time}.</p>
        <p>Le confirmaremos su reserva a la brevedad.</p>
        <div>
          <p>Detalles de su reserva:</p>
          <ul>
            <li>Fecha: ${reservation.date}</li>
            <li>Hora: ${reservation.time}</li>
            <li>Personas: ${reservation.guests}</li>
            ${reservation.notes ? `<li>Notas: ${reservation.notes}</li>` : ''}
          </ul>
        </div>
        <p>Saludos cordiales,<br>Equipo Tregua</p>
      </div>
    `
  }),
  
  status_update: (reservation: Reservation) => ({
    subject: `Actualización de reserva - Tregua`,
    html: `
      <div>
        <h2>Tregua Restaurant</h2>
        <p>Estimado/a ${reservation.name},</p>
        <p>Su reserva para el día ${reservation.date} a las ${reservation.time} ha sido ${
          reservation.status === 'confirmed' ? 'confirmada' : 'rechazada'
        }.</p>
        
        ${reservation.status === 'confirmed' 
          ? '<p>Le esperamos para disfrutar de una experiencia gastronómica única.</p>' 
          : '<p>Lamentamos no poder atenderle en esta ocasión.</p>'
        }
        
        <div>
          <p>Detalles de su reserva:</p>
          <ul>
            <li>Fecha: ${reservation.date}</li>
            <li>Hora: ${reservation.time}</li>
            <li>Personas: ${reservation.guests}</li>
            ${reservation.notes ? `<li>Notas: ${reservation.notes}</li>` : ''}
          </ul>
        </div>
        
        <p>Saludos cordiales,<br>Equipo Tregua</p>
      </div>
    `
  }),
  
  cancellation: (reservation: Reservation) => ({
    subject: 'Cancelación de reserva - Tregua',
    html: `
      <div>
        <h2>Tregua Restaurant</h2>
        <p>Estimado/a ${reservation.name},</p>
        <p>Su reserva para el día ${reservation.date} a las ${reservation.time} ha sido cancelada.</p>
        
        <div>
          <p>Detalles de su reserva cancelada:</p>
          <ul>
            <li>Fecha: ${reservation.date}</li>
            <li>Hora: ${reservation.time}</li>
            <li>Personas: ${reservation.guests}</li>
            ${reservation.notes ? `<li>Notas: ${reservation.notes}</li>` : ''}
          </ul>
        </div>
        
        <p>Esperamos poder atenderle en otra ocasión.</p>
        <p>Saludos cordiales,<br>Equipo Tregua</p>
      </div>
    `
  })  
};