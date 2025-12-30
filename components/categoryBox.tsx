import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryBoxProps {
    title: string;
    icon: React.ReactNode
    isSelected: boolean
    onPress: ()=> void;
    color: string;
}



export default function CategoryBox({title, icon, isSelected, color, onPress} : CategoryBoxProps){
    


    return(
        <TouchableOpacity style={
            [styles.button,
            {
             backgroundColor: color,
            }, 
            isSelected && styles.selectedCategory,
            ]

        } onPress={onPress}>
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

const styles = StyleSheet.create({
    button :{
        width: 152,
        height: 152,
        borderRadius: 25,
        alignContent: 'center'
    },

    selectedCategory : {
        borderWidth: 2,
        borderColor: '#6734F2',
    }
})


