import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';



interface CategoryModalProps {
  label: string;
  placeholder: string;
  selectedValue? : string
  onSelect: (value : string) => void;
}




const CategoryBoxV2: React.FC<CategoryModalProps> = ({label, placeholder, selectedValue, onSelect}) => {


  return (

    <View style={styles.CategoryBox}>
    <TouchableOpacity style={styles.CategoryContainer}>
    <Text style={styles.TextCategory}>{label}</Text>
    <Text style={{marginLeft: 3}}>{selectedValue || placeholder}</Text>
    </TouchableOpacity>
  
    </View>
  );
};



const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      },


      CategoryBox : {
        alignSelf: 'flex-start',
        paddingTop: 18,
        marginTop: 18,
        width: '98%',
        maxWidth: '98%'
      },
    
      CategoryContainer : {
        borderWidth: 1,
        borderColor: '#c9c9c9',
        borderRadius: 8,
        paddingTop: 16,
        paddingBottom: 16, 
        paddingLeft: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
    
      TextCategory : {
        position: 'absolute',
        bottom: 42,
        left: 12,
        color: '#757575',
        backgroundColor: '#ffff',
        paddingRight: 5,
        fontSize: 12
      },



      modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: 10,
        paddingTop: 10,
        minHeight: 750, // Adjust as needed
      },
      handleBar: {
        minWidth: '112%',
        height: 75,
        backgroundColor: '#6734F2',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        position: 'absolute',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: 110
      },
    
      content: {
        flex: 1,
        marginTop: 65,
        height: 'auto',
        width: '100%',
      },

      categoryBox:{
        maxWidth: '100%',
        height: 380,
        gap: 23,
        paddingHorizontal: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 30
      },

      othersBox : {
        maxWidth: '100%',
        height: 150,
        paddingHorizontal: 3,
        paddingTop: 15
      },

      InputContainer1 : {
        borderWidth: 1,
        borderColor: '#c9c9c9',
        borderRadius: 8,
        paddingTop: 5,
        paddingBottom: 3,
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '95%',
        marginTop: 25
      },
    
      InputText : {
        position: 'absolute',
        bottom: 39,
        left: 10,
        color: '#757575',
        backgroundColor: '#ffff',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 12,
      },

      InputButton :{
        marginTop: 25,
        backgroundColor: '#6734F2',
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 8
      },
})


export default CategoryBoxV2;