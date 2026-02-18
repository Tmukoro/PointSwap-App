import { Conversation, Message } from "@/types/message";
import axios from "axios";


const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1"


class MessageService {
    private axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: apiUrl
        })
    }

    




    // Set auth token (call this after user logs in)
  setAuthToken(token: string) {
     
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Get Ably token from your backend
  async getAblyToken(): Promise<string> {
    const response = await this.axiosInstance.get('/messages/ably-token');
    return response.data.data.token;
  }

  // Get all user conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await this.axiosInstance.get('/conversations');
    return response.data.data.conversations;
  }

  // Start a new conversation (send first message)
  async sendFirstMessage(recipientId: string, messageText: string) {
    const response = await this.axiosInstance.post('/messages', {
      recipient_id: recipientId,
      message_text: messageText,
    });
    return response.data.data;
  }

  // Send message to existing conversation
  async sendMessage(conversationId: string, messageText: string): Promise<Message> {
    const response = await this.axiosInstance.post(
      `/conversations/${conversationId}/messages`,
      {
        message_text: messageText,
      }
    );
    return response.data.data.message;
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    const response = await this.axiosInstance.get(
      `/conversations/${conversationId}/messages`,
      {
        params: { limit, offset },
      }
    );
    return response.data.data.messages;
  }

  // Mark conversation as read
  async markAsRead(conversationId: string): Promise<void> {
    await this.axiosInstance.put(`/conversations/${conversationId}/read`);
  }
}





export default new MessageService();

