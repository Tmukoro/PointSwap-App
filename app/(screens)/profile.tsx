import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import uploadService from "@/services/uploadService";
import { ProfileResponse } from "@/types/auth";
import { GetUserDetails } from "@/types/profile";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen(){

    const route = useRouter();

    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [token, setToken] = useState<string | null>(null)
    const [email, setEmail] = useState<string>('')
    const [localImageUri, setLocalImageUri] = useState<string>('')
    const [avatarUrl, setAvatarUrl] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)


    const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1/userProfile";

    const apiUrl2 = "http://192.168.0.134:8080/pointSwapApi/v1/profileSetUp";


    const fetchUserData = async()=>{
        try{

            const storedToken = await SecureStore.getItemAsync("token")

            if(!storedToken){
                setLoading(false)
                return
            }

            setToken(storedToken);

            const response = await axios.get<GetUserDetails>(apiUrl, {
                headers: {"Authorization": `Bearer ${storedToken}`}
            });

            const userData = response.data.data

            setFirstName(userData.first_name)
            setLastName(userData.last_name)
            setLocalImageUri(userData.avatar_url)
            setEmail(userData.email)
    
        }catch(error){
            console.error("Error fetching data: ", error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchUserData()
    }, [])

    if(loading || !token){
        return <ActivityIndicator size={'large'} />
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
        const imgUri = result.assets[0].uri
          setAvatarUrl(imgUri)
        try{
          setUploading(true)
          const UploadUrl =  await uploadService.uploadImage(imgUri, 'profile');
          setLocalImageUri(UploadUrl)
        }catch(error){
          console.log(error)
        }finally{
          setUploading(false)

        }
      }
    };

      const ProfileSave = async () => {

        const storedToken = await SecureStore.getItemAsync("token")
  
        if(!storedToken){
          console.log("No token found")
          return
        }
  
        let profReq = {
          first_name: firstName,
          last_name: lastName,
          avatar_url: localImageUri
        };
  
        try{
           await axios.post<ProfileResponse>(apiUrl2, profReq, {
           headers:  { 
            "Content-Type":"application/json",
            "Authorization":`Bearer ${storedToken}`
           },
           
          });
    
          route.push('/(tabs)/settings')
  
        }catch(error){
          console.log(error)
        }
  
      }



    return(
       
       <View style={styles.container}>

        <View style={styles.imagecontainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageCircle}>           
           {localImageUri ? (
        <Image source={{uri: localImageUri || avatarUrl}} style={styles.image} />
           ): (
            <Text>No Image?</Text>
           )}
          </TouchableOpacity>

          <Text style={{top: 15}}>Edit Profile Image</Text>
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
           value={firstName} onChangeText={setFirstName}
           ></TextInput>
           </View>


           <View style={styles.InputContainer2}>
           <Text style={styles.InputText2}>Last Name</Text>
           <TextInput placeholder="Eki" style={{width: '80%'}}
           value={lastName} onChangeText={setLastName}
           ></TextInput>
           </View>

           </View>        






           <TouchableOpacity 
          style={[styles.accessbutton, uploading && styles.buttonDisabled]} 
          onPress={ProfileSave}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>Save</Text>
              <ChevronRight color={'#fff'} size={'$1'} />
            </>
          )}
        </TouchableOpacity> 


        <View style={styles.messageCont}>
          <Text>* Please make sure to upload your personal picture to ensure other corp users can recognise you within the camp</Text>
        </View>

    

      </View>


            
    )
}


const styles = StyleSheet.create({
    container: {
       alignContent: 'center',
       alignItems: 'center',
       backgroundColor: '#fff',
       height: '100%'
    },

    imagecontainer :{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44,
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
        marginTop: 53,
        borderRadius: 2,
        backgroundColor: '#FFFAEB',
        alignSelf: 'center'
      },

      buttonDisabled: {
        opacity: 0.6,
      },

})