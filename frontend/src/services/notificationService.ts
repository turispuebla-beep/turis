import axios from 'axios';
import { config } from '../config';

interface AdminCredentials {
  email: string;
  accessCode: string;
  domain: string;
  password: string;
}

export class NotificationService {
  private baseUrl = config.apiUrl;

  async sendAdminCredentials(credentials: AdminCredentials): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/notifications/send-credentials`, credentials);
    } catch (error) {
      console.error('Error sending admin credentials:', error);
      throw error;
    }
  }

  async sendTeamNotification(teamId: string, message: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/notifications/team/${teamId}`, { message });
    } catch (error) {
      console.error('Error sending team notification:', error);
      throw error;
    }
  }
}