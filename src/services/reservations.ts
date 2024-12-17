import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CreateReservationDTO, Reservation } from '../types/reservation';
import { smsService } from './notifications/smsService';
import { sendCustomerEmail, sendAdminEmail } from './notifications/emailService';
import { reservationSchema } from '../schemas/reservationSchema';

const COLLECTION = 'reservations';

function validateReservationTime(time: string): boolean {
  const validTimes = ['12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
  return validTimes.includes(time);
}

export async function createReservation(data: CreateReservationDTO) {
  try {
    // Validar los datos con el schema primero
    const validationResult = reservationSchema.safeParse(data);
    if (!validationResult.success) {
      const error = validationResult.error.errors[0];
      throw new Error(error.message);
    }

    // Validar fecha en el pasado
    const reservationDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      throw new Error('No se pueden hacer reservas en fechas pasadas');
    }

    // Validar horario de reserva
    if (!validateReservationTime(data.time)) {
      throw new Error('Horario de reserva no disponible');
    }

    // Store the date as is, without UTC conversion
    const formattedDate = data.date;

    let docRef;
    try {
      docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        date: formattedDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Error al crear la reserva');
    }

    const reservation = {
      id: docRef.id,
      ...data,
      date: formattedDate,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    
    // Send both notifications
    try {
      await Promise.all([
        smsService.sendCustomerSMS('new', reservation),
        smsService.sendAdminSMS(reservation),
        sendCustomerEmail('new', reservation),
        sendAdminEmail(reservation)
      ]);
      console.log('Notifications sent successfully');
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
    return docRef.id;
  } catch (error) {
    console.error('Error creating reservation:', error);
    if (error instanceof Error) {
      // Si es un error de validación o negocio, propagar el mensaje original
      if (error.message.includes('No se pueden hacer reservas') ||
          error.message.includes('Horario de reserva') ||
          error.message.includes('El número de personas') ||
          error.message.includes('Formato de teléfono') ||
          error.message.includes('Error al crear la reserva')) {
        throw error;
      }
    }
    // Para cualquier otro tipo de error, usar el mensaje genérico
    throw new Error('Error al crear la reserva');
  }
}

export async function getReservations() {
  try {
    const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Reservation[];
  } catch (error) {
    console.error('Error getting reservations:', error);
    throw new Error('Error al obtener las reservas');
  }
}

export async function updateReservationStatus(id: string, status: Reservation['status']) {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Reservation not found');
    }

    await updateDoc(docRef, { 
      status,
      updatedAt: new Date().toISOString()
    });

    const reservation = { 
      id, 
      ...docSnap.data() as Omit<Reservation, 'id'>,
      status 
    } as Reservation;
    
    // Send both notifications
    try {
      await Promise.all([
        smsService.sendCustomerSMS('status_update', reservation),
        sendCustomerEmail('status_update', reservation)
      ]);
      console.log('Status update notifications sent successfully');
    } catch (error) {
      console.error('Error sending status update notifications:', error);
    }

    return reservation;
  } catch (error) {
    console.error('Error updating reservation status:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error al actualizar el estado de la reserva');
  }
}


export async function cancelReservation(id: string) {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Reservation not found');
    }

    await updateDoc(docRef, { 
      status: 'cancelled',
      updatedAt: new Date().toISOString()
    });

    const reservation = { 
      id, 
      ...docSnap.data() as Omit<Reservation, 'id'>,
      status: 'cancelled' as const
    } as Reservation;
    
    // Send both notifications
    try {
      await Promise.all([
        smsService.sendCustomerSMS('cancellation', reservation),
        sendCustomerEmail('cancellation', reservation)
      ]);
      console.log('Cancellation notifications sent successfully');
    } catch (error) {
      console.error('Error sending cancellation notifications:', error);
    }

    return reservation;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw new Error('Error al cancelar la reserva');
  }
}

export async function deleteReservation(id: string) {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Reservation not found');
    }

    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw new Error('Error al eliminar la reserva');
  }
}