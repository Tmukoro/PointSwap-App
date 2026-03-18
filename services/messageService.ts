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


  async createConversation(recipientId: string) {
    const response = await this.axiosInstance.post('/conversations', {
      recipient_id: recipientId,
    });
    return response.data.data.conversation_id;
  }

  // Start a new conversation (send first message)
  async sendFirstMessage(recipientId: string, messageText: string, imageUrl?: string) {
    const response = await this.axiosInstance.post('/messages', {
      recipient_id: recipientId,
      message_text: messageText,
      image_url: imageUrl,
    });
    return response.data.data;
  }

  // Send message to existing conversation
  async sendMessage(conversationId: string, messageText: string, imageUrl?: string): Promise<Message> {
    const payload = {
      message_text: messageText,
      image_url: imageUrl,
    };
        
    const response = await this.axiosInstance.post(
      `/conversations/${conversationId}/messages`,
      payload
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



  async uploadImage(imageUri: string): Promise<string> {
    const formData = new FormData();
    
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
  
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);
  
    const response = await this.axiosInstance.post('/upload/image?type=chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    // Handle both singular and plural responses
    const imageUrl = response.data.data.image_url || response.data.data.image_urls?.[0];
    
    if (!imageUrl) {
      throw new Error('No image URL returned from server');
    }
  
    return imageUrl;
  }



}





export default new MessageService();

