import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function PhotoBox ({image_url}) {
    return(
        <TouchableOpacity style={styles.photoBox}>
         <Image style={{width: 60, height: 60, borderRadius: 10}} source={image_url} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    photoBox : {
        width: 60,
        height: 60,
        borderRadius: 10
    }
})