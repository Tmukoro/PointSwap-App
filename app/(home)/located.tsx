import LocatedIcon from "@/components/SvgIcons/locationfound";
import { ChevronRight } from "@tamagui/lucide-icons";

import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";




export default function LocationFoundScreen (){

    const route = useRouter();

    return(

        <View style={styles.container}>

            <View style={{marginTop: 160}}>

                <LocatedIcon />

            </View>



      <View style={styles.Welcomebox}>

        <Text style={{fontSize: 24, fontWeight: '600', marginTop: 30, paddingLeft: 21}}>We&apos;ve located you!</Text>

        <View style={{marginTop: 8, width: 310, marginLeft: 21 }}>
        <Text style={{fontSize: 16, color: '#292929', fontWeight: '400'}}>You&apos;re in Lagos State camp</Text>
        </View>


        <TouchableOpacity style={styles.accessbutton} onPress={()=>route.navigate('/items')}>
          <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>Continue to items</Text>
          <ChevronRight color={'#fff'} size={'$1'} />
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
        paddingLeft: 105,
        paddingRight: 105,
        borderRadius: 8,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center'
      }

})