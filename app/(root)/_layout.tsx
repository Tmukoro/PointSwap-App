import { Stack } from "expo-router";


export default function RootStack() {
  return(
       <Stack
       screenOptions={{
        headerShown: false
       }}
       initialRouteName="(home)"
       >
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
