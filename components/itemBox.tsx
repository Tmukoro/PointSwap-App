import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
export default function ItemBox () {



    


    return(
    <TouchableOpacity style={styles.itemBoxD}>
    <Image style={{width: 80, height: 80, borderRadius: 8, marginLeft: 10}} source={require('../assets/images/cap3.png')} />
    <View style={{paddingRight: 160, paddingTop: 10, flexDirection: 'column', gap: 10 }}>
        <Text style={{fontSize: 14, fontWeight: 600}}>Neat NYSC top</Text>
        <Text style={{fontSize: 14, fontWeight: 600, color: 'gray'}}>Size: M</Text>
     </View>
  </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemBoxD : {
        maxWidth: '93%',
        borderWidth: 1,
        paddingTop: 13,
        paddingBottom: 13,
        marginLeft: 10,
        borderRadius: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: '#ffff',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: -4},
        shadowRadius: 13,
        shadowOpacity: 0.25,
        elevation: 7,
        marginTop: 20
    }
})


