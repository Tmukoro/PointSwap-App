import SettingBox from "@/components/settingBox";
import AccountIcon from "@/components/SvgIcons/accountIcon";
import CalenderIcon from "@/components/SvgIcons/calenderIcon";
import HelpIcon from "@/components/SvgIcons/helpIcon";
import TAFIcon from "@/components/SvgIcons/tafIcon";
import NotificationIcon from "@/components/TabIcons/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen (){

    const route = useRouter()

    const [avatar_url, setAvatarUrl] = useState<string | null>('');
    const [first_name, setFirstName] = useState<string | null>('');
    const [last_name, setLastName] = useState<string | null>('');

    const loadUserData = async()=>{
        try{
            const fName = await AsyncStorage.getItem("first_name")
            const lName = await AsyncStorage.getItem("last_name")
            const avatar = await AsyncStorage.getItem("avatar_url")

            if(fName) setFirstName(fName);
            if(lName) setLastName(lName);
            if(avatar) setAvatarUrl(avatar)
        } catch(error){
            console.log(error)
        }
    }

    const logout = async()=>{

        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',

            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress : async() =>{
                        await SecureStore.deleteItemAsync('token');
                        route.push('/(home)') 
                    },
                },
            ],

            {cancelable: true}
        );



    }

    useEffect(()=>{
        loadUserData();
    }, []);
    

    return(
        <View style={styles.container}>

            {/* PROFILE BOX */}

            <TouchableOpacity style={styles.profileBox}>
            <View>
                  {avatar_url ? (
                        <Image
                        source={{uri: avatar_url}}
                        style={{width: 50, height: 50, borderRadius: 25}} />                        
                        ):(
                            <Text>No image?</Text>
                        )}
            </View>

            <View>
                <Text style={{fontSize: 16, fontWeight: 600}}>{first_name} {last_name}</Text>
                <Text style={{fontSize: 14}}>View profile</Text>
            </View>

            </TouchableOpacity>


            {/* SETTINGS OPTIONS */}

           <View style={styles.settings}>
            
            <SettingBox
            icon={<NotificationIcon color="#6734F2"/>}
            text="Notifications"
            />

            <SettingBox
            icon={<CalenderIcon />}
            text="My adverts"
            />

            <SettingBox
            icon={<HelpIcon />}
            text="Help"
            />

            <SettingBox
            icon={<AccountIcon />}
            text="Account"
            />

            <SettingBox
            icon={<TAFIcon />}
            text="Tell a friend"
            />
    
            </View>


            <TouchableOpacity style={styles.logOutBtn} onPress={logout}>
                <Text style={{fontSize: 15, color: 'red', fontWeight: 600}}>Log out</Text>
            </TouchableOpacity>



          


        </View>
    )
}


const styles = StyleSheet.create({
    container: {
       padding: 0,
       margin: 0,
       alignContent: 'center',
       alignItems: 'center',
       backgroundColor: '#fff',
       height: '100%',
       paddingVertical: 15
    },

    profileBox : {
        width: '100%',
        height: 80,
        flexDirection: 'row',
        gap: 13,
        paddingHorizontal: 23,
        alignItems: 'center',
        paddingTop: 20
    },

    settings : {
        width: '100%',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 40
    },

    logOutBtn : {
        width: 150,
        borderWidth: 1,
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#FAD4D1',
        borderColor: 'pink'
    }
})