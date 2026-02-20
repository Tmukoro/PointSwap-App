import { Stack } from "expo-router"


export default function ScreensLayout(){


    return(

        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="chat-details" /> 
          <Stack.Screen name="notification" />
          <Stack.Screen name="myAdvert" />
          <Stack.Screen name="help" />
          <Stack.Screen name="productView" />
          <Stack.Screen name="profile"
           options={{
              headerShown: true,
              headerTitle: 'Edit Profile',
           }}
          />
        </Stack>
    )
}