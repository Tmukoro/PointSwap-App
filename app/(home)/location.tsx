import HillIcon from "@/components/SvgIcons/hillIcon";
import locationService from "@/services/locationService";
import { ChevronRight } from "@tamagui/lucide-icons";

import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";




export default function LocationDetectScreen (){

  const route = useRouter();

  const [loading, setLoading] = useState<boolean>(false)

  const handleAllowLocation = async () => {
    setLoading(true);

    try {
      // Request permission
      const hasPermission = await locationService.requestPermission();

      if (!hasPermission) {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'We need your location to show you products from people in your camp. Please enable location in settings.'
        })
        setLoading(false);
        return;
      }

      // Get current location
      const location = await locationService.getCurrentLocation();

      if (!location) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not get your location. Please try again.'
        })
        setLoading(false);
        return;
      }

      // Send to backend to determine camp
      const result = await locationService.sendLocationToBackend(
        location.latitude,
        location.longitude
      );

      // Navigate to confirmation screen with camp details
      route.push({
        pathname: '/(home)/located',
        params: {
          state: result.location_state,
          camp: result.camp_name,
        },
      });
    } catch (error: any) {
      console.error('Location error:', error);
      
      if (error.response?.status === 404) {
        Toast.show({
          type: 'error',
          text1: 'No Camp Found',
          text2: 'We could not find an NYSC camp near your location. Please make sure you are at or near an orientation camp.'
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to set your location. Please try again.'
        })
      }
    } finally {
      setLoading(false);
    }
  };





    return(

        <View style={styles.container}>

            <View style={{marginTop: 160}}>

                <HillIcon />

            </View>



      <View style={styles.Welcomebox}>

        <Text style={{fontSize: 24, fontWeight: '600', marginTop: 30, paddingLeft: 21}}>Location</Text>

        <View style={{marginTop: 8, width: 310, marginLeft: 21 }}>
        <Text style={{fontSize: 16, color: '#292929', fontWeight: '400'}}>We’ll would like to access your location and know which camp you are in.</Text>
        </View>


        <TouchableOpacity style={styles.accessbutton} onPress={handleAllowLocation}>
          {loading? (
            <ActivityIndicator color={'#fff'} />
          ):(
            <>
          <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>Allow location access</Text>
          <ChevronRight color={'#fff'} size={'$1'}  />            
            </>
          )}

        </TouchableOpacity>

        

      </View>






        </View>



    )


}




const styles = StyleSheet.create({

    container :{
        height: '100%',
        backgroundColor: '#fff',
        padding: 0,
        margin: 0
    },

    Welcomebox :{
        marginTop: 60,
        height: '100%',
        width: '100%',
        borderRadius: 25,
        backgroundColor: 'white',
        borderColor: '#ffff',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: -4},
        shadowRadius: 13,
        shadowOpacity: 0.25,
        elevation: 7
      },
    
      accessbutton: {
        marginTop: 100,
        backgroundColor: '#6734F2',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 85,
        paddingRight: 85,
        borderRadius: 8,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center'
      }

})