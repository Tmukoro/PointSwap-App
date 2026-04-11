import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import authService from '@/services/authService';
import uploadService from '@/services/uploadService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronRight } from "@tamagui/lucide-icons";
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';




export default function ProfileSetUpScreen (){

  const route = useRouter();
  const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1/profileSetUp";




    const [first_name, setFirstName] = useState<string>('');
    const [last_name, setLastName] = useState<string>('');
    const [localImageUri, setLocalImageUri] = useState<string>('')
    const [avatar, setAvatarUrl] = useState<string>('')
    const [email, setEmail] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    useEffect(()=>{

      const fetchData = async()=>{
        const storedToken = await SecureStore.getItemAsync("token")
        const storedEmail = await AsyncStorage.getItem("userEmail")

        setToken(storedToken);
        setEmail(storedEmail);
      };

      fetchData();

    }, [])

    if(!token){
      return <ActivityIndicator size={'large'}></ActivityIndicator>
    }

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (!result.canceled) {
        const imageUri = (result.assets[0].uri);
        try{
          setUploading(true)
          const uploadedUrl = await uploadService.uploadImage(imageUri, 'profile');
          setLocalImageUri(uploadedUrl); 
          setAvatarUrl(uploadedUrl)
        }catch(error){
          console.error(error)
        }finally{
           setUploading(false)
        }
      }
    };





    const ProfileSave = async () => {
  
      if (!localImageUri) {
        Toast.show({
          type: 'error',
          text1: 'Please add a profile photo!'
        })
        return;
      }

      try{
        await authService.profileSetUp({
          first_name: first_name,
          last_name: last_name,
          avatar_url: localImageUri
        })
        Toast.show({
          type: 'success',
          text1: 'Profile Successfully Created'
        })
        route.push("/location")
      }catch(error: any){
        if(!error.response){
          Toast.show({
            type: 'error',
            text1: 'Network Error',
            text2: 'Please Check Connection'
          })
        }
        switch(error.response?.status){
          case 400:
            Toast.show({
              type: 'error',
              text1: 'Invalid Input',
              text2: 'Please fill in the required details!'
            })
            break;
          default:
            Toast.show({
              type: 'error',
              text1: 'Something went wrong'
            })
        }
      }

    }

    


    return(


        <View style={styles.container}>

          


          <View style={styles.imagecontainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageCircle}>
          {!localImageUri && <Text style={{color: 'black', position: 'absolute'}}>Add Photo</Text>}
          {localImageUri && <Image source={{ uri: localImageUri }} style={styles.image} />}
        </TouchableOpacity>
         </View>




             <View style={styles.Inputbox}>


     
            <View style={styles.InputContainer1}>
            <Text style={styles.InputText1}>Email</Text>
            <TextInput style={{width: '83%'}} placeholder={`${email ?? ""}`} editable = {false}
            ></TextInput>
            </View>


           <View style={styles.InputContainer2}>
           <Text style={styles.InputText2}>First Name</Text>
           <TextInput placeholder="Chioma" style={{width: '80%'}}
           value={first_name} onChangeText={setFirstName}
           ></TextInput>
           </View>


           <View style={styles.InputContainer2}>
           <Text style={styles.InputText2}>Last Name</Text>
           <TextInput placeholder="Eki" style={{width: '80%'}}
           value={last_name} onChangeText={setLastName}
           ></TextInput>
           </View>

           </View>        






        <TouchableOpacity style={styles.accessbutton}
         onPress={ProfileSave}
         disabled={uploading}
         >
          {uploading ? (
            <ActivityIndicator color={'#fff'} />
          ):(
            <>
            <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>Continue</Text>
            <ChevronRight color={'#fff'} size={'$1'} />
            </>
          )}
        </TouchableOpacity> 


        <View style={styles.messageCont}>
          <Text style={{}}>* Please make sure to upload your personal picture to ensure other corp users can recognise you within the camp</Text>
        </View>

    

      </View>





    )


}




const styles = StyleSheet.create({

    container :{
        height: '100%',
        backgroundColor: '#fff',
        padding: 0,
        margin: 0
    },

    imagecontainer :{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 84,
        paddingBottom: 14
    },

    imageCircle : {
        borderRadius: '50%',
        backgroundColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        margin: 'auto'
    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },



     Inputbox :{
        display: 'flex',
        alignSelf: 'flex-start',
        paddingTop: 40,
        paddingLeft: 17,
        marginTop: 35,
        width: '95%'
      },
  
      InputContainer1 :{
        borderWidth: 1,
        borderColor: '#c9c9c9',
        borderRadius: 8,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center'
      },

  
      InputText1: {
        position: 'absolute',
        bottom: 37,
        left: 10,
        color: '#757575',
        backgroundColor: '#ffff',
        paddingLeft: 5,
        paddingRight: 5,
      },
  
      InputContainer2 :{
        marginTop: 35,
        borderWidth: 1,
        borderColor: '#c9c9c9',
        borderRadius: 8,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center'
      },
  
  
      InputText2: {
        position: 'absolute',
        bottom: 37,
        left: 10,
        color: '#757575',
        backgroundColor: '#ffff',
        paddingLeft: 5,
        paddingRight: 5,
      },

      accessbutton: {
        marginTop: 30,
        backgroundColor: '#6734F2',
        paddingTop: 15,
        paddingBottom: 15,
        width: '90%',
        borderRadius: 8,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },

      messageCont :{
        width: '90%',
        padding: 20,
        marginLeft: 22,
        marginTop: 53,
        borderRadius: 2,
        backgroundColor: '#FFFAEB'
      }
  



})