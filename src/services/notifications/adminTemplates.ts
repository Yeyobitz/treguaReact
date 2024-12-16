import { Reservation } from '../../types/reservation';

export const adminTemplates = {
  email: (reservation: Reservation) => ({
    subject: 'Nueva reserva recibida - Tregua',
    html: `
      <div>
        <h2>Tregua Restaurant</h2>
        <p>Nueva reserva recibida:</p>
        
        <div>
          <ul>
            <li>Nombre: ${reservation.name}</li>
            <li>Email: ${reservation.email}</li>
            <li>Teléfono: ${reservation.phone}</li>
            <li>Fecha: ${reservation.date}</li>
            <li>Hora: ${reservation.time}</li>
            <li>Personas: ${reservation.guests}</li>
            ${reservation.notes ? `<li>Notas: ${reservation.notes}</li>` : ''}
          </ul>
        </div>
        
        <p>Por favor, revise y confirme la reserva.</p>
        <p>Saludos,<br>Sistema de Reservas Tregua</p>
      </div>
    `
  })
};