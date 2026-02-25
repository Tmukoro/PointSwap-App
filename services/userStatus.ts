import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.134:8080/pointSwapApi/v1';

class UserStatusService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
    });
  }

  setAuthToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async updateStatus(isOnline: boolean) {
    try {
      await this.axiosInstance.put('/users/status', {
        is_online: isOnline,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  }

  async getUserStatus(userId: string) {
    try {
      const response = await this.axiosInstance.get(`/users/${userId}/status`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get user status:', error);
      return { is_online: false, last_seen: null };
    }
  }
}

export default new UserStatusService();