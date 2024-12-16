import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CreateReservationDTO, Reservation } from '../types/reservation';
import { smsService } from './notifications/smsService';
import { sendCustomerEmail, sendAdminEmail } from './notifications/emailService';

const COLLECTION = 'reservations';

export async function createReservation(data: CreateReservationDTO) {
  try {
    // Ensure the date is stored in ISO format at UTC midnight
    const reservationDate = new Date(data.date);
    
    const utcDate = new Date(Date.UTC(
      reservationDate.getFullYear(),
      reservationDate.getMonth(),
      reservationDate.getDate()
    ));

    
    

    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      date: utcDate.toISOString().split('T')[0], // Store only the date part
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    const reservation = {
      id: docRef.id,
      ...data,
      date: utcDate.toISOString().split('T')[0],
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };
    
    // Send both notifications
    try {
      await Promise.all([
        smsService.sendCustomerSMS('new', reservation),
        smsService.sendAdminSMS(reservation),
        sendCustomerEmail('new', reservation),
        sendAdminEmail(reservation)  // Add this line
      ]);
      console.log('Notifications sent successfully');
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
    return docRef.id;
  } catch (error) {
    console.error('Error creating reservation:', error);
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