import AddItemIcon from "@/components/SvgIcons/addItemsIcon";


import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";




export default function AdditemsScreen (){

    const route = useRouter();

    return(

        <View style={styles.container}>

            <View style={{marginTop: 160}}>

                <AddItemIcon />

            </View>



      <View style={styles.Welcomebox}>

        <Text style={{fontSize: 24, fontWeight: '600', marginTop: 30, paddingLeft: 21}}>Add items</Text>

        <View style={{marginTop: 8, width: 310, marginLeft: 21 }}>
        <Text style={{fontSize: 16, color: '#292929', fontWeight: '400'}}>Would you like to add items now or later?</Text>
        </View>


        <View style={styles.optionbutton}>

        <TouchableOpacity style={styles.button1} onPress={()=>route.navigate('/(tabs)/home')} >
          <Text style={{color: '#6734F2', fontSize: 14, fontWeight: '600'}}>Maybe later</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.button2}>
            <Text style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>I&apos;ll add now</Text>
        </TouchableOpacity>

        </View>



        

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

      optionbutton: {
        marginTop: 100,
        flexDirection: 'row',
        gap:20,
        alignItems: 'center',
        alignSelf: 'center'
      },
    
      button1: {
        backgroundColor: '#D0C0FB',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 40,
        paddingRight: 40,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'
      },

      button2: {
        backgroundColor: '#6734F2',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 40,
        paddingRight: 40,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'

      }

})