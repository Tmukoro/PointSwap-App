import userStatus from "@/services/userStatus";
import { Stack, useRouter } from "expo-router";

import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, AppState, AppStateStatus, View } from "react-native";

export default function RootStack() {

  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("token")

        if (token) {
          route.replace('/(tabs)/home')
        } else {
          route.replace('/(home)')
        } 

      } catch (error) {
        console.error(error)
        route.replace('/(home)')
      } finally {
        setLoading(false)
      }
    };

    checkAuth();
  }, [route])

  // Online status tracking
  useEffect(() => {
    // Set user online when app starts
    setUserOnline();

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      // Set offline when app unmounts
      setUserOffline();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App came to foreground - set online
      setUserOnline();
    } else if (nextAppState.match(/inactive|background/)) {
      // App went to background - set offline
      setUserOffline();
    }

    appState.current = nextAppState;
  };

  const setUserOnline = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      userStatus.setAuthToken(token)
      await userStatus.updateStatus(true);
      console.log('User set to ONLINE'); // Debug log
    }
  };

  const setUserOffline = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      userStatus.setAuthToken(token)
      await userStatus.updateStatus(false);
      console.log('User set to OFFLINE'); // Debug log
    }
  };

  // NOW the loading check
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    ); 
  }



  return(
       <Stack
       screenOptions={{
        headerShown: false
       }}
       >
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(screens)" />
    </Stack>
  )

}
