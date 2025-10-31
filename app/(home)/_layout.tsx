import { Stack } from "expo-router";



export default function HomePageScreen(){
    return(
        <Stack screenOptions={{headerShown: false}}
        >

            <Stack.Screen name="index" />
            <Stack.Screen name="registration"/>
            <Stack.Screen name="profile" />
            <Stack.Screen name="login" />
            <Stack.Screen name="location" />
            <Stack.Screen name="located" />
            
        </Stack>
    )
}