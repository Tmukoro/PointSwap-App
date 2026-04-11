// eslint-disable-next-line import/no-named-as-default
import tamaguiConfig from "@/tamui.config";
import { Slot } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";
import { PortalProvider, TamaguiProvider } from "tamagui";



export default function RootLayout() {
  return(
    
    <KeyboardProvider>
    <TamaguiProvider config={tamaguiConfig}>
      <PortalProvider>
        <Slot />
    </PortalProvider>
    <Toast  />
    </TamaguiProvider>
    </KeyboardProvider>
  )
}
