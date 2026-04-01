export interface Notification {
    id: string;
    user_id: string;
    notification_type: string;
    title: string;
    body: string;
    related_product_id?: string;
    related_user_id?: string;
    related_conversation_id?: string;
    is_read: boolean;
    is_pushed: boolean;
    created_at: string;
    read_at?: string;
    other_user_name?: string;
    other_user_avatar?: string;
    product_title?: string;
  }