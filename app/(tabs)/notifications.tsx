import NotificationItem from '@/components/NotificationItem';
import notificationService from '@/services/notificationService';
import { Notification } from '@/types/notification';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        notificationService.setAuthToken(token);
        const data = await notificationService.getNotifications();
                
        // Handle null or undefined response
        if (data && Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]); // Set empty array if null
        }
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]); // Set empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleNotificationPress = async (notificationId: string) => {
    // Mark as read
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const groupNotificationsByDate = () => {
    const today: Notification[] = [];
    const thisWeek: Notification[] = [];
    const older: Notification[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    notifications.forEach(notif => {
      const notifDate = new Date(notif.created_at);
      
      if (notifDate >= todayStart) {
        today.push(notif);
      } else if (notifDate >= weekStart) {
        thisWeek.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, thisWeek, older };
  };

  const renderSection = (title: string, data: Notification[]) => {
    if (data.length === 0) return null;

    return (
      <View>
        <Text style={styles.sectionHeader}>{title}</Text>
        {data.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onPress={() => handleNotificationPress(notification.id)}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6734F2" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    );
  }

  const { today, thisWeek, older } = groupNotificationsByDate();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notification</Text>
      <FlatList
        data={[1]} // Dummy data to use FlatList with sections
        renderItem={() => (
          <>
            {renderSection('Today', today)}
            {renderSection('This week', thisWeek)}
            {renderSection('Older', older)}
          </>
        )}
        keyExtractor={() => 'notifications'}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    padding: 20,
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
});