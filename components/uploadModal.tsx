import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
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
import CheckIcon from './SvgIcons/checkIcon';
import CloseIcon from './SvgIcons/closeIcon';
import OptionsIcon from './SvgIcons/OptionsIcon';
import UploadIcon from './SvgIcons/UplaodIcon';

import Dropdown from './dropdown';

import productService from '@/services/productService';
import uploadService from '@/services/uploadService';
import CategoryBoxV2 from './categoryBoxV2';
interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
}


const { height } = Dimensions.get('screen');

const UploadModal: React.FC<UploadModalProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [showRequiredModal, setShowRequiredModel] = useState<boolean>(false)

  const [size, setSize] = useState('')
  const sizeOptions = ['S', 'M', 'L', 'XL'];
  const [category, setCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [localImageUris, setLocalImageUris] = useState<string[]>([])
  const [wantedCategory, setWantedCategory] = useState<string>(category)
  const [wantedSize, setWantedSize] = useState<string>('')

  const productID = useRef<string>('')
  

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

  }, [visible, slideAnim]);

  useEffect(() => {
    if (!visible) {
        setTitle('')
        setSize('')
        setImageUrls([])
        setWantedSize('')
    }
}, [visible])


  const pickImage = async ()=> {
     let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 4
     });

     if(!result.canceled){
      const newImageUriS = result.assets.map((asset)=> asset.uri);
      setLocalImageUris((prev)=> [...prev, ...newImageUriS].slice(0,4));
     }
  }





 
  const productUploadFunction = async ()=>{
    try{
      await uploadService.uploadImages(localImageUris, 'product')
      const response = await productService.CreateProduct({
        category: category,
        photo_urls: localImageUris,
        title: title,
        estimated_size: size
      })
      productID.current = response.product_id
      setShowRequiredModel(true)
      onClose()
    }catch(error){
      console.error("Could not create Product: ", error)
    }
  }

  const productWantSubmit = async () =>{
    setWantedCategory(category)
    try {
      await productService.CreateProductWant({
        wantCategory: wantedCategory,
        wantSize: wantedSize,
      }, productID.current)

      setShowRequiredModel(false)
      setCategory('')
      setWantedCategory('')
    }catch(error){
      console.log(error)
    }



  }


  return (
    <>
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onDismiss={()=>{
        setCategory('')
        setImageUrls([])
        setTitle('')
        setSize('')
      }}
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
              pointerEvents='box-none'
            >
              {/* Handle bar */}
              <View style={styles.handleBar}>
                <TouchableOpacity onPress={onClose}>
                <CloseIcon />
                </TouchableOpacity>
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

                <CategoryModal
                 label='Category(required)'
                 placeholder='Select'
                 selectedValue={category}
                 onSelect={setCategory}
                 />

                

                {/* IMAGE PICKER */}
                <View style={{height: 170, maxWidth: '100%', marginTop: 26}}>
                <Text style={{color: '#292929', fontWeight: '600', fontSize: 16}}>Add photos</Text>

                {/* Image selector */}
                <View style={styles.ImageSelectorContainer}>
                 <UploadIcon onPress={pickImage}  /> 
                 {localImageUris.map((uri, index)=>(
                  <View key={index} style={styles.imageSelector}>
                   <Image source={{uri}} style={styles.image} />

                   {index === 0 && (
                    <CheckIcon style={{bottom: 10, left: 6}} />
                   )}
                   </View>

                 ))}
                </View>

                <Text>• First picture is the title picture</Text>
                <Text>• Drag & drop photos to change the order</Text>

                </View>

                {/* INPUT LAYER */}
                <View style={{height: 170, maxWidth: '100%', paddingTop: 15}}>

               <View style={styles.InputContainer1}>
               <Text style={styles.InputText}>Title (required)</Text>
               <TextInput placeholder="(e.g NYSC White Shirt)"
                value={title} onChangeText={setTitle}
               style={{paddingLeft: 11, width: '80%'}}
               ></TextInput>
               </View>

               
               <View style={styles.CategoryBox2}>
                <Dropdown
                label='Estimated Size(required)'
                placeholder='Select'
                options={sizeOptions}
                selectedValue={size}
                onSelect={setSize}
                />

                </View> 

                </View>


                {/* MESSAGE BOX */}

                <View style={styles.messageBox}>
                 <Text style={{color: '#C99603', fontSize: 12, maxWidth: '95%'}}>*Please don’t post NYSC prohibited items on the app or risk prosecution.
                   Thank you for helping us maintain a safe environment
                    for all users ❤️
                    </Text>
                </View>


           <TouchableOpacity style={styles.InputButton} onPress={productUploadFunction}>
            <Text style={{textAlign: 'center', color: 'white'}}>Post now</Text>
           </TouchableOpacity>                




              </ScrollView>

            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

    {/* PRODUCT WANT */}

    <Modal visible={showRequiredModal} transparent animationType='fade'
     onDismiss={()=>{
      setWantedSize('')
     }}
    >
      <View style={styles.PWbox}>
         
         <View>
         <Text>Please provide what size you need</Text>
         </View>
        <CategoryBoxV2
         label='Category'
         placeholder={category}
         onSelect={setWantedCategory}
         />

        <Dropdown
          label='Estimated Size(required)'
          placeholder='Select'
          options={sizeOptions}
          selectedValue={wantedSize}
          onSelect={setWantedSize}
           />

           <TouchableOpacity style={styles.PWbtn} onPress={productWantSubmit}>
            <Text style={{color: 'white'}}>Done</Text>
           </TouchableOpacity>

      </View>

    </Modal>

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

  CategoryBox2 : {
    alignSelf: 'flex-start',
    paddingTop: 8,
    marginTop: 8,
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
    marginTop: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
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

  image: {
    width: 60,
    height: 60,
    borderRadius: 8
  },

  imageSelector: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'flex-end'
  },

  PWbox : {
    padding: 20,
    backgroundColor: '#fff',
    margin: 'auto',
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c9c9c9'
  },

  PWbtn : {
    backgroundColor: '#6734F2',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  }

});

export default UploadModal;