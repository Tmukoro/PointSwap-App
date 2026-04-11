import SettingBox from "@/components/settingBox";
import AccountIcon from "@/components/SvgIcons/accountIcon";
import CalenderIcon from "@/components/SvgIcons/calenderIcon";
import HelpIcon from "@/components/SvgIcons/helpIcon";
import TAFIcon from "@/components/SvgIcons/tafIcon";
import NotificationIcon from "@/components/TabIcons/notification";
import { GetUserDetails } from "@/types/profile";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function SettingsScreen (){
    const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1/userProfile";


    const route = useRouter()

    const [avatar_url, setAvatarUrl] = useState<string | null>('');
    const [first_name, setFirstName] = useState<string | null>('');
    const [last_name, setLastName] = useState<string | null>('');
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const loadUserData = async()=>{

        try{

        const storedToken = await SecureStore.getItemAsync('token')

        if(!storedToken){
            setLoading(false)
            return
        }

        setToken(storedToken)

        const response = await axios.get<GetUserDetails>(apiUrl, {
            headers: {"Authorization" : `Bearer ${storedToken}`}
        })

        const userData = response.data.data

        setFirstName(userData.first_name)
        setLastName(userData.last_name)
        setAvatarUrl(userData.avatar_url)

       }catch(error){
        Toast.show({
            type: 'error',
            text1: 'Something went wrong'
        })
       }finally{
        setLoading(false)
       }
        
    }

    useEffect(()=>{
        loadUserData();
    }, []);

    if(loading || !token){
        return (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#6734F2" />
            </View>
          );   
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
                        await SecureStore.deleteItemAsync('user_id')
                        route.push('/(home)') 
                    },
                },
            ],

            {cancelable: true}
        );



    }



    

    return(
        <View style={styles.container}>

            {/* PROFILE BOX */}

            <TouchableOpacity style={styles.profileBox} onPress={()=> route.push('/(screens)/profile')}>
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
            onPress={()=> route.push('/(screens)/notification')}
            />

            <SettingBox
            icon={<CalenderIcon />}
            text="My adverts"
            onPress={()=> route.push('/(screens)/myAdvert')}
            />

            <SettingBox
            icon={<HelpIcon />}
            text="Help"
            onPress={()=> route.push('/(screens)/help')}
            />

            <SettingBox
            icon={<AccountIcon />}
            text="Account"
            onPress={()=> route.push('/(screens)/notification')}
            />

            <SettingBox
            icon={<TAFIcon />}
            text="Tell a friend"
            onPress={()=> route.push('/(screens)/notification')}
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

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
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