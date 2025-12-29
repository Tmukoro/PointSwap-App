import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import CategoryModal from './categoryModal';
import CloseIcon from './SvgIcons/closeIcon';
import OptionsIcon from './SvgIcons/OptionsIcon';
import PolygonIcon from './SvgIcons/PolygonIcon';
import UploadIcon from './SvgIcons/UplaodIcon';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
}


const { height } = Dimensions.get('screen');

const UploadModal: React.FC<UploadModalProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  

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

  const navigateToCategory = ()=>{
      setShowCategoryModal(true)
  }

  const handleCategoryModel = ()=>{
    setShowCategoryModal(false)
  }

  return (
    <>
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
                <CloseIcon onPress={onClose} />
                <Text style={{color: 'white', fontWeight: '600', fontSize: 16, paddingLeft: 15}}>Add items</Text>
                <OptionsIcon />
              </View>  

              {/* Add your content here */}
              <ScrollView 
              style={styles.scrollContent}
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps='handled'
              showsVerticalScrollIndicator= {false}
              >

                <View style={styles.CategoryBox}>
                  <TouchableOpacity style={styles.CategoryContainer} onPress={navigateToCategory} >
                  <Text style={styles.TextCategory}>Category(required)</Text>
                  <Text style={{marginLeft: 3}}>Select</Text>
                  <PolygonIcon style={{marginRight: 18}} />
                  </TouchableOpacity>
                </View>

                {/* IMAGE PICKER */}
                <View style={{height: 170, maxWidth: '100%', marginTop: 26}}>
                <Text style={{color: '#292929', fontWeight: '600', fontSize: 16}}>Add photos</Text>

                {/* Image selector */}
                <View style={styles.ImageSelectorContainer}>
                 <UploadIcon  /> 
                </View>

                <Text>• First picture is the title picture</Text>
                <Text>• Drag & drop photos to change the order</Text>

                </View>

                {/* INPUT LAYER */}
                <View style={{height: 170, maxWidth: '100%', paddingTop: 15}}>

               <View style={styles.InputContainer1}>
               <Text style={styles.InputText}>Title (required)</Text>
               <TextInput placeholder="(e.g NYSC White Shirt)" style={{paddingLeft: 11}}
               ></TextInput>
               </View>

               
               <View style={styles.CategoryBox}>
                  <TouchableOpacity style={styles.CategoryContainer}>
                  <Text style={styles.TextCategory}>Estimated size (required)</Text>
                  <Text style={{marginLeft: 3}}>Select</Text>
                  <PolygonIcon style={{marginRight: 18}} />
                  </TouchableOpacity>
                </View> 

                </View>


                {/* MESSAGE BOX */}

                <View style={styles.messageBox}>
                 <Text style={{color: '#C99603', fontSize: 12, maxWidth: '95%'}}>*Please don’t post NYSC prohibited items on the app or risk prosecution.
                   Thank you for helping us maintain a safe environment
                    for all users ❤️
                    </Text>
                </View>


           <TouchableOpacity style={styles.InputButton}>
            <Text style={{textAlign: 'center', color: 'white'}}>Post now</Text>
           </TouchableOpacity>                




              </ScrollView>

            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

    <CategoryModal 
      visible={showCategoryModal}
      onClose={handleCategoryModel}
      />
    </>
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
    height: height * 0.9,
    maxHeight: height * 0.9
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
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    gap: 75
  },

  scrollContent: {
    flex: 1
  },
  content: {
    marginTop: 65,
    width: '100%',
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

  ImageSelectorContainer : {
    height: 85, 
    maxWidth: '100%', 
    marginTop: 2,
    justifyContent: 'center',
  },

  InputContainer1 : {
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    paddingTop: 3,
    paddingBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '98%',
  },

  InputText : {
    position: 'absolute',
    bottom: 37,
    left: 10,
    color: '#757575',
    backgroundColor: '#ffff',
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 12,
  },

  messageBox: {
    borderWidth: 1, 
    maxWidth: '98%', 
    height: 80, 
    borderRadius : 4, 
    backgroundColor: '#FFFAEB',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFFAEB'
  },

  InputButton :{
    marginTop: 25,
    backgroundColor: '#6734F2',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 8
  },


});

export default UploadModal;