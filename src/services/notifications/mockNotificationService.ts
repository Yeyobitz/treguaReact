import { Reservation } from '../../types/reservation';
import { NotificationType } from './types';

class MockNotificationService {
  private logNotification(type: string, message: string) {
    console.log(`[${type} Notification] ${new Date().toISOString()}`);
    console.log(message);
    console.log('-------------------');
  }

  async sendEmail(to: string, subject: string, body: string) {
    this.logNotification('Email', `
      To: ${to}
      Subject: ${subject}
      Body: ${body}
    `);
    return Promise.resolve();
  }

  async sendSMS(to: string, message: string) {
    this.logNotification('SMS', `
      To: ${to}
      Message: ${message}
    `);
    return Promise.resolve();
  }
}

export const mockNotificationService = new MockNotificationService();