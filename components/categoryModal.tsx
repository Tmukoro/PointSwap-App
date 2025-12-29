import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import CloseIcon from '@/components/SvgIcons/closeIcon';
import CategoryBox from './categoryBox';

import CapCategory from './SvgIcons/capCatIcon';
import ShirtsCategory from './SvgIcons/shirtCatIcon';
import ShoesCategory from './SvgIcons/shoeCatIcon';
import ShortCategory from './SvgIcons/shortCatIcon';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
}



const { height } = Dimensions.get('screen');

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      // Slide up
      Animated.spring(slideAnim, {
        toValue: 15,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      // Slide down
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Dark overlay - tapping closes modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Modal content - tapping inside doesn't close */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Handle bar */}
              <View style={styles.handleBar}>
                <CloseIcon onPress={onClose} style={{marginLeft: 40}} />
                <Text style={{color: 'white', fontWeight: '600', fontSize: 16}}>Category</Text>
              </View>  

              {/* Add your content here */}
              <View style={styles.content}>
                 {/* SELECT CATEGORY BOX */}
                <View style={styles.categoryBox}>
                  <CategoryBox
                   color={'#E8F8EC'}
                   title={'Cap 🧢'}
                   icon={<CapCategory />} 
                  />

                  <CategoryBox 
                  color='#FFF7E1'
                  title='Shorts 🩳'
                  icon ={<ShortCategory />}
                  />

                  <CategoryBox
                   color='#E2ECFD'
                   title='Shoes 🥾'
                   icon={<ShoesCategory />}  
                  />

                  <CategoryBox
                  color='#F0EBFE'
                  title='Shirts 👕'
                  icon={<ShirtsCategory />}
                  />
                </View>

                {/* Other Category Box */}
                <View style={styles.othersBox}>
                 <Text style={{width: '85%', fontWeight: 400, fontSize: 14}}>Can&apos;t find the category you want? 
                  Type in the relevant category in the text box below
                  </Text>

                <View style={styles.InputContainer1}>
               <Text style={styles.InputText}>Other categories</Text>
               <TextInput style={{paddingLeft: 11}}
               ></TextInput>
               </View>

                </View>







           {/* <TouchableOpacity style={styles.InputButton}>
            <Text style={{textAlign: 'center', color: 'white'}}>Post now</Text>
           </TouchableOpacity>                 */}




              </View>

            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};



const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
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
        alignSelf: 'center',
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
        gap: 15,
        paddingHorizontal: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
      },

      othersBox : {
        maxWidth: '100%',
        height: 150,
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
})


export default CategoryModal;