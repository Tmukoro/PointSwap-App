import BackIcon from "@/components/SvgIcons/backIcon";
import ExportIcon from "@/components/SvgIcons/exportIcon";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function ProductViewScreen(){
    return(
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backIcon}>
                <BackIcon />
                <Text>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ExportIcon />
                </TouchableOpacity>
            </View>

            {/* IMAGE BOX */}
            <View style={styles.ImageContainer}>

            </View>

            {/* DETAILS BOX */}
            <View style={styles.detailsBox}>

            </View>


            {/* CONTACT BOX */}
            <View style={styles.contactBox}>

                <View style={styles.profileContainer}>

                </View>

            <View style={styles.messageCont}>
                <Text>*Remember to be respectful and kind when messaging other users. Make this a safe and welcoming community for everyone. Thank you 🫂</Text>
            </View>

            <View style={styles.contactOption}>

            </View>
                

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

    headerContainer : {
        height: 100,
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        alignItems: 'center',
        gap: 30
    },

    backIcon:{
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      marginLeft: 10,
    },

    ImageContainer: {

    },

    detailsBox: {

    },

    contactBox :{

    },

    profileContainer: {

    },

    messageCont: {
        width: '90%',
        padding: 20,
        marginTop: 53,
        borderRadius: 2,
        backgroundColor: '#FFFAEB',
        alignSelf: 'center'
    },

    contactOption: {

    }


})