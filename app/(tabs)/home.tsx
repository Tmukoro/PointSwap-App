import FifthRoute from "@/tabHomePages/fifthRoute";
import FirstRoute from "@/tabHomePages/firstRoute";
import FourthRoute from "@/tabHomePages/fourthRoute";
import SecondRoute from "@/tabHomePages/secondRoute";
import ThirdRoute from "@/tabHomePages/thirdRoute";
import { GetUserDetails } from "@/types/profile";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TabBar, TabView } from 'react-native-tab-view';
export default function TabHomeScreen (){

    const [avatar_url, setAvatarUrl] = useState<string | null>('');
    const [token, setToken] = useState<string | null>(null);
    const [first_name, setFirstName] = useState<string | null>('');
    const [loading, setLoading] = useState(true)



    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'first': return <FirstRoute />
            case 'second': return <SecondRoute />
            case 'third': return <ThirdRoute />
            case 'fourth': return <FourthRoute />
            case 'fifth': return <FifthRoute />
            default: return null
        }
    }


    const routes = [
        {key : 'first', title: "Shirts"},
        {key : 'second', title: "Shorts"},
        {key : 'third', title: "Shoes"},
        {key : 'fourth', title: "Jackets"},
        {key: 'fifth', title: 'Trousers'}
    ]

    const layout = useWindowDimensions();
    const savedIndex = useRef(0)
    const [index, setIndex] = useState(0)
    
    const handleIndexChange = (newIndex: number) => {
        savedIndex.current = newIndex
        setIndex(newIndex)
    }



// Used to fetch user details from the backend
const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1/userProfile";

    useEffect(()=>{
        const fetUserData = async ()=>{
            try {
                const storedToken = await SecureStore.getItemAsync("token");

                if(!storedToken){
                    setLoading(false)
                    return
                }

                setToken(storedToken);

                const response = await axios.get<GetUserDetails>(apiUrl, {
                    headers: {"Authorization" : `Bearer ${storedToken}`}
                });

                const userData = response.data.data

                setFirstName(userData.first_name)
                setAvatarUrl(userData.avatar_url)

            } catch(error){
                console.log(error)
            } finally {
                setLoading(false)
            }
        };

        fetUserData();

    }, [])


    if(loading || !token){
        return <ActivityIndicator size={'large'}></ActivityIndicator>
    }
    
    
    return(

        <View style={styles.container}>

            {/* NAVBAR SECTION */}

            <View style={styles.navbar}>

                <View style={styles.namecontainer}>
                    <View style={{marginLeft: 20}}>
                    <Text style={{fontWeight: 600, fontSize: 24, color: 'white'}}>Hi, {first_name}👋</Text>
                    <Text style={{fontWeight: 400, fontSize: 16, color: 'white', paddingTop: 8}}>Let&apos;s start swapping!</Text>
                    </View>

                    {/* IMAGE PFP PART */}

                    <View style={{marginRight: 25}}>
                        {avatar_url ? (
                            <Image
                            source={{uri: avatar_url}}
                            style={{width: 50, height: 50, borderRadius: 25}} />
                        
                        ):(
                            <Text>No image?</Text>
                        )}
                    </View>
                </View>
            </View>


            {/* TAB BAR SECTION */}

            <View>




            <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            lazy
            onIndexChange={handleIndexChange}
            initialLayout={{ width: layout.width }}
             renderTabBar={props => (
               
            <TabBar
          {...props}
          renderIndicator={({ position, getTabWidth, layout }) => {
            // Create a "pill" indicator that matches the width of the tab
            const inputRange = props.navigationState.routes.map((_, i) => i);
            const translateX = position.interpolate({
              inputRange,
              outputRange: props.navigationState.routes.map((_, i) => i * 100),
            });

            return (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 0,
                  transform: [{ translateX }],
                  width: layout.width / routes.length - 5,
                  marginHorizontal: 12,
                  height: 38,
                  borderRadius: 20,
                  backgroundColor: 'white',
                }}
              />
            );
          }}
          style={{
            backgroundColor: '#6734F2',
            paddingBottom: 10,
          }}
          activeColor="#6734F2"
          inactiveColor="white"
          scrollEnabled
          tabStyle={{width: 100}}
        />
        


      )}
        />

            </View>






        </View>
    )
}




const styles = StyleSheet.create({
    container: {
       padding: 0,
       margin: 0,
       alignContent: 'center',
       alignItems: 'center',
       backgroundColor: '#fff'
    },

    navbar : {
        backgroundColor: '#6734F2',
        height: 155,
        width: '100%'
    },

    namecontainer : {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 3,
        alignItems: 'center',
        paddingTop: 75
    },

})