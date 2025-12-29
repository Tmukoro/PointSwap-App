import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function CategoryBox({title, color, icon} : {title: string; color: string; icon: React.ReactNode}){
    return(
        <TouchableOpacity style={{
            backgroundColor: color,
            width: 152,
            height: 152,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: color,
            alignContent: 'center'
        }}>
        <View style={{
            borderRadius: 25, 
            width: 100, 
            height: 110,
            padding: 25
            }}>
        {icon}
        </View>
        <View>
            <Text style={{
                paddingLeft: 23,
                fontWeight: 600,
                fontSize: 16
            }}>{title}</Text>
        </View>
        </TouchableOpacity>
    )
}
