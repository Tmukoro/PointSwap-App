// eslint-disable-next-line import/no-named-as-default
import tamaguiConfig from "@/tamui.config";
import { Stack } from "expo-router";
import { TamaguiProvider } from "tamagui";



export default function RootLayout() {
  return(

    <TamaguiProvider config={tamaguiConfig}>
    <Stack
       screenOptions={{
        headerShown: false
       }}
       initialRouteName="(home)"
    >
      <Stack.Screen name="(home)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
    </TamaguiProvider>
  )
}
