import * as Ably from 'ably';
import messageService from './messageService';


class AblyService {
  private client: Ably.Realtime | null = null;
  private channel: Ably.RealtimeChannel | null = null;

  // Initialize Ably with auth callback
  async connect(): Promise<void> {
    try {
      this.client = new Ably.Realtime({
        echoMessages: false,
        // authCallback fetches a fresh token whenever needed
        authCallback: async (tokenParams, callback) => {
          try {
            const token = await messageService.getAblyToken();
            callback(null, token);
          } catch (error) {
            callback(error as string, null);
          }
        },
      });

      return new Promise((resolve, reject) => {
        this.client!.connection.on('connected', () => {
          console.log('Connected to Ably');
          resolve();
        });

        this.client!.connection.on('failed', (error) => {
          console.error('Ably connection failed:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error connecting to Ably:', error);
      throw error;
    }
  }

  // Subscribe to a conversation channel
  subscribeToConversation(
    conversationId: string,
    onMessageReceived: (message: any) => void
  ): Ably.RealtimeChannel {
    if (!this.client) {
      throw new Error('Ably client not initialized');
    }

    const channelName = `conversation:${conversationId}`;
    this.channel = this.client.channels.get(channelName);

    // Listen for new messages
    this.channel.subscribe('new_message', (message) => {
      console.log('Received message:', message.data);
      onMessageReceived(message.data);
    });

    return this.channel;
  }

    // Subscribe to typing events
    subscribeToTyping(
      conversationId: string,
      onUserTyping: (userId: string, isTyping: boolean) => void
    ): void {
      if (!this.channel) {
        throw new Error('Channel not initialized');
      }
  
      this.channel.subscribe('typing', (message) => {
        console.log('Typing event:', message.data);
        onUserTyping(message.data.user_id, message.data.is_typing);
      });
    }
  
    // Publish typing event
    publishTypingStatus(conversationId: string, userId: string, isTyping: boolean): void {
      if (!this.channel) {
        console.warn('Channel not initialized, cannot publish typing status');
        return;
      }
  
      this.channel.publish('typing', {
        user_id: userId,
        is_typing: isTyping,
      });
    }

  // Unsubscribe from current channel
  unsubscribe(): void {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
  }

  // Disconnect from Ably
  disconnect(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }
}

export default new AblyService();