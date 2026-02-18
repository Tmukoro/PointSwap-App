import { Stack, useRouter } from "expo-router";

import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootStack() {

  const route = useRouter();

  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    const checkAuth = async ()=> {
      try{

        const token = await SecureStore.getItemAsync("token")

        if(token){
          route.replace('/(tabs)/home')
        } else{
          route.replace('/(home)')
        } 

      }catch(error){
        console.error(error)
        route.replace('/(home)')
      }finally{
        setLoading(false)
      }

    };

   checkAuth();
  }, [route])

if(loading){
   return(
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
