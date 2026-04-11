import userStatus from "@/services/userStatus";
import { Stack, useRouter } from "expo-router";

import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, AppStateStatus, View } from "react-native";
// const API_BASE_URL = 'http://192.168.0.134:8080/pointSwapApi/v1';

export default function RootStack() {
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const appState = useRef(AppState.currentState);





  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (token) {
          setIsAuthenticated(true);
          userStatus.setAuthToken(token);
          await userStatus.updateStatus(true);
          
          // Register for push notifications
  // const pushToken = await notificationService.registerForPushNotifications();
  //         if (pushToken) {
  //           try {
  //             await axios.post(
  //               `${API_BASE_URL}/push-token`,
  //               { 
  //                 token: pushToken, 
  //                 device_type: Platform.OS 
  //               },
  //               { headers: { Authorization: `Bearer ${token}` } }
  //             );
  //             console.log('Push token registered with backend');
  //           } catch (error) {
  //             console.error('Failed to register push token:', error);
  //           }
  //         }
          
          route.replace('/(tabs)/home');
        } else {
          route.replace('/(home)');
        } 

      } catch (error) {
        console.error(error);
        route.replace('/(home)');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [route]);

  // Online status tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    setUserOnline();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      setUserOffline();
    };
  }, [isAuthenticated]);

  // Handle notification taps
  // useEffect(() => {
  //   const subscription = notificationService.addNotificationResponseReceivedListener(response => {
  //     const data = response.notification.request.content.data;
      
  //     if (data.type === 'new_message' && data.conversation_id) {
  //       // Navigate to chat screen
  //       route.push({
  //         pathname: '/(screens)/chat-details',
  //         params: { 
  //           conversationId: String(data.conversation_id)
  //         }
  //       });
  //     }
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setUserOnline();
    } else if (nextAppState.match(/inactive|background/)) {
      setUserOffline();
    }

    appState.current = nextAppState;
  };

  const setUserOnline = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      userStatus.setAuthToken(token);
      await userStatus.updateStatus(true);
      console.log('User set to ONLINE');
    }
  };

  const setUserOffline = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      userStatus.setAuthToken(token);
      await userStatus.updateStatus(false);
      console.log('User set to OFFLINE');
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    ); 
  }


  return(
    <>
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(screens)" />
    </Stack>


    </>
  );
}