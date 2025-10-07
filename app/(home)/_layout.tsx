import { Stack } from "expo-router";



export default function HomePageScreen(){
    return(
        <Stack screenOptions={{headerShown: false}}
        >

            <Stack.Screen name="index" />
            <Stack.Screen name="registration"/>
            <Stack.Screen name="login" />

        </Stack>
    )
}