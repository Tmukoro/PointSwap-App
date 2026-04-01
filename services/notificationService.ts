import { Notification } from '@/types/notification';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.134:8080/pointSwapApi/v1';

class NotificationApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async getNotifications(): Promise<Notification[]> {
    const response = await this.axiosInstance.get('/notifications');
    return response.data.data.notifications;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.axiosInstance.put(`/notifications/${notificationId}/read`);
  }

  async getUnreadCount(): Promise<number> {
    const response = await this.axiosInstance.get('/notifications/unread-count');
    return response.data.data.unread_count;
  }
}

export default new NotificationApiService();