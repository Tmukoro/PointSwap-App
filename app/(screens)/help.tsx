import { StyleSheet, Text, View } from "react-native";


export default function HelpScreen(){
    return(
        <View style={styles.container}>
            <Text>Nothing to see here for now</Text>
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
    }
})