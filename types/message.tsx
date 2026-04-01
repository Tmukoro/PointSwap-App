export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string | null;
  message_text: string;
  image_url?: string | null; 
  audio_url?: string | null;
  audio_duration?: number | null; 
  is_read: boolean;
  created_at: string;
  deleted_at: string | null;
}


export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message_text: string | null;
  unread_count: number;
}


export interface SendMessageRequest {
  recipient_id: string;
  message_text: string;
  image_url?: string;
  audio_url?: string;  
  audio_duration?: number; 
}