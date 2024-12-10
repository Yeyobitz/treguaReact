import { Reservation } from '../../types/reservation';

export type NotificationType = 'new' | 'status_update' | 'cancellation';

export interface NotificationData {
  type: NotificationType;
  reservation: Reservation;
  createdAt: string;
  status: 'pending' | 'processed' | 'error';
  error?: string;
}