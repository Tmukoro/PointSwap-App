import { Tabs } from "expo-router";

import AddIcon from "@/components/TabIcons/add";
import ChatIcon from "@/components/TabIcons/chat";
import HomeIcon from "@/components/TabIcons/home";
import NotificationIcon from "@/components/TabIcons/notification";
import SettingsIcon from "@/components/TabIcons/settings";
import UploadModal from "@/components/uploadModal";
import { useState } from "react";

export default function TabsLayout (){

  const [isModalVisible, setIsModalVisible] = useState(false)

    return(
       <>
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#292929',
            tabBarStyle : {
              height: 85,
              paddingTop: 10,
              paddingBottom: 10
            }
        }}>

            <Tabs.Screen name="home"
              options={{
                title : "Home",
                tabBarIcon : ()=> <HomeIcon   />
              }}
            />
            <Tabs.Screen name="chat"
               options={{
                title : 'Chats',
                tabBarIcon: ()=> <ChatIcon />
               }}
            />

            <Tabs.Screen name="upload"
            options={{
               tabBarIcon: ()=> <AddIcon style={{marginTop: 10}} />,
               title : ''
            }}

            listeners={{
              tabPress: (e) =>{
                e.preventDefault();
                setIsModalVisible(true);
              },
            }}
             />

            <Tabs.Screen name="notifications"
              options={{
                title: 'Notifications',
                tabBarIcon: ()=> <NotificationIcon />
              }}
            />

            <Tabs.Screen name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ()=> <SettingsIcon />,
                headerShown: true,
                headerStyle: {height: 110},
                headerTitleStyle: {paddingTop: 38, fontSize: 24}
              }}
            />
             
            


        </Tabs>

        <UploadModal
             visible={isModalVisible}
             onClose={()=> setIsModalVisible(false)}
            />

        </>
    )

}