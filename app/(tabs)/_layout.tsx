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
            tabBarActiveTintColor: '#6734F2',
            tabBarInactiveTintColor: '#757575',
            tabBarStyle : {
              height: 85,
              paddingTop: 10,
              paddingBottom: 10
            }
        }}>

            <Tabs.Screen name="home"
              options={{
                title : "Home",
                tabBarIcon : ({color})=> <HomeIcon color={color}   />
              }}
            />
            <Tabs.Screen name="chat"
               options={{
                title : 'Chats',
                tabBarIcon: ({color})=> <ChatIcon color={color} />,
                headerShown: true,
                headerTitleStyle: {fontSize: 24, fontWeight: 600, top: 15},
                headerStyle: {height: 110}
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
                tabBarIcon: ({color})=> <NotificationIcon color={color} />,
              }}
            />

            <Tabs.Screen name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({color})=> <SettingsIcon color={color} />,
                headerShown: true,
                headerStyle: {height: 110},
                headerTitleStyle: {fontSize: 24, top: 15}
              }}
            />

            <Tabs.Screen name="productView"
               options={{
                headerShown: false,
                href: null,
                tabBarStyle: {display: "none"}
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