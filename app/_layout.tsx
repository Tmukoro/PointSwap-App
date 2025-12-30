// eslint-disable-next-line import/no-named-as-default
import tamaguiConfig from "@/tamui.config";
import { Slot } from "expo-router";
import { PortalProvider, TamaguiProvider } from "tamagui";



export default function RootLayout() {
  return(

    <TamaguiProvider config={tamaguiConfig}>
      <PortalProvider>
        <Slot />
    </PortalProvider>
    </TamaguiProvider>
  )
}
