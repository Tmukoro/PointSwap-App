import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface ItemProps {
    title : string,
    estimated_size : string,
    onPress : ()=> void
}


export default function AdvertBox ({title, estimated_size, onPress}: ItemProps) {
    return(
    <TouchableOpacity style={styles.itemBoxD} onPress={onPress}>
    <View style={{padding: 5, flexDirection: 'column', gap: 10 }}>
        <Text style={{fontSize: 14, fontWeight: 600}}>{title}</Text>
        <Text style={{fontSize: 14, fontWeight: 600, color: 'gray'}}>Size: {estimated_size}</Text>
     </View>
  </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemBoxD : {
        width: '80%',
        maxWidth: '80%',
        borderWidth: 1,
        paddingTop: 13,
        paddingBottom: 13,
        alignSelf: 'flex-start',
        borderRadius: 15,
        backgroundColor: 'white',
        borderColor: '#ffff',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: -4},
        shadowRadius: 13,
        shadowOpacity: 0.25,
        elevation: 7,
        marginTop: 20,
        paddingHorizontal: 5,
        marginLeft: 20
    }
})


