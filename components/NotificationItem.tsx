import { Notification } from '@/types/notification';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const router = useRouter();

  const handlePress = () => {
    onPress(); // Mark as read

    // Navigate based on notification type
    if (notification.notification_type === 'product_match' && notification.related_product_id) {
      router.push({
        pathname: '/(tabs)/productView',
        params: { product_id: notification.related_product_id }
      });
    } else if (notification.notification_type === 'new_message' && notification.related_conversation_id) {
      router.push({
        pathname: '/(screens)/chat-details',
        params: { conversationId: notification.related_conversation_id }
      });
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !notification.is_read && styles.unread
      ]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {notification.other_user_avatar ? (
          <Image 
            source={{ uri: notification.other_user_avatar }} 
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {notification.other_user_name?.charAt(0) || '?'}
            </Text>
          </View>
        )}
        {!notification.is_read && <View style={styles.unreadDot} />}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.body}>{notification.body}</Text>
        <Text style={styles.time}>{getTimeAgo(notification.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unread: {
    backgroundColor: '#f8f4ff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: '#6734F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  unreadDot: {
    position: 'absolute',
    bottom: 9,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6734F2',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  body: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});