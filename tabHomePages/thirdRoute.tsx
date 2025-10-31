import SortIcon from "@/components/SvgIcons/sortIcon";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ThirdRoute () {
    return(
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            {/* Sortbutton box area */}

            <View style={styles.sortbox}>
                <Text style={{fontSize: 16, fontWeight: 600, paddingLeft: 14}}>Recently added</Text>
                <TouchableOpacity style={styles.sortbutton}>
                <Text style={{color: '#6734F2', fontSize: 14, fontWeight: 600}}>Sort by</Text>
                <SortIcon />
                </TouchableOpacity>
            </View>

            <View style={styles.itemBox}>


            </View>


        

        </View>

    );  
}


const styles = StyleSheet.create({
    sortbox:{
        maxWidth: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 15
    },

    sortbutton : {
      paddingRight: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3
    },

    itemBox : {
        height: '100%',
        backgroundColor: 'blue'
    }
})



