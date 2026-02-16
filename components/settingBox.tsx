import React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RightArrow from "./SvgIcons/rightArrow";


interface boxProps {
    icon: React.ReactNode,
    text: string,
}


export default function SettingBox({icon, text} : boxProps){
    return(
        <TouchableOpacity style={styles.settingBox}>
            <View style={styles.iconBox}>
            {icon}
            <Text style={{fontSize: 14, fontWeight: 400}}>{text}</Text>
            </View>

            <RightArrow />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    settingBox :{
        maxWidth: '90%',
        width: '90%',
        paddingTop: 18,
        paddingBottom: 18,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 22,
        marginTop: 10,
        marginBottom: 10,
        borderColor: '#E6E6E6'     
    },

    iconBox : {
        width: 130,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})