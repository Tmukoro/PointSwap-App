import { Tabs } from "expo-router";

export default function TabsLayout (){

    return(
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#292929'
        }}>

            <Tabs.Screen name="home"
              options={{
                title : "Home",
              }}
            />
            <Tabs.Screen name="chat" />
            <Tabs.Screen name="upload" />
            <Tabs.Screen name="notification" />
            <Tabs.Screen name="settings" />

        </Tabs>
    )

}