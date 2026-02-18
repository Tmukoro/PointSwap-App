import RectangleIcon from "@/components/rectangle";
import { CheckboxWithLabel } from "@/components/SvgIcons/CheckBox";
import FacebookIcon from "@/components/SvgIcons/facebookIcon";
import GoogleIcon from "@/components/SvgIcons/googleIcon";
import LockIcon from "@/components/SvgIcons/LockIcon";
import SmsIcon from "@/components/SvgIcons/SmsIcon";
import { Link, useRouter } from "expo-router";
import { useState } from "react";


import messageService from "@/services/messageService";
import { LoginResponse } from "@/types/auth";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";







export default function LoginScreen(){

  const router = useRouter();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const LoginFunction = async () => {



    const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1/login";

    let loginReq = {
      email : email,
      password: password
    }

    try {
      const response = await axios.post<LoginResponse>(apiUrl, loginReq, {
        headers : {"Content-Type" : "application/json"}
      });

      const token = response.data.data.token

      const userID = response.data.data.user.user_id

      await SecureStore.setItemAsync("token", token)

      await SecureStore.setItemAsync("user_id", userID)

      messageService.setAuthToken(token)

      router.push('/home')


    } catch(error){
      console.log(error)
    }

  }





    return(

        <View style={styles.container}>

            {/* WELCOME BACK BOX */}

            <View style={styles.WBbox}>

                <Text style={{fontSize: 24, fontWeight: 'bold'}}>Welcome back</Text>
                <Text style={{fontSize: 16, color: '#292929'}}>We&apos;re glad to see you again!</Text>

            </View>


            {/* INPUT BOX */}

             <View style={styles.Inputbox}>


     
            <View style={styles.InputContainer1}>
            <Text style={styles.InputText1}>Email</Text>
            <SmsIcon style={styles.smsicon} />
            <TextInput style={{width: '83%'}} placeholder="Emmanuel6@gmail.com"
             value={email} onChangeText={setEmail}
            ></TextInput>
            </View>


           <View style={styles.InputContainer2}>
           <Text style={styles.InputText2}>Password</Text>
           <LockIcon style={styles.lockicon} />
           <TextInput placeholder="•••••••••••••" secureTextEntry = {true} style={{fontWeight: 'bold', width: '83%'}}
            value={password} onChangeText={setPassword} 
           ></TextInput>
           </View>

           <View style = {styles.RPbox}>
            <CheckboxWithLabel label="Remember me" />
            <Text style={{fontSize: 14, color: '#6734F2'}}>Forgot Password?</Text>

           </View>


           
           <TouchableOpacity style={styles.InputButton} onPress={LoginFunction}>
            <Text style={{textAlign: 'center', color: 'white'}}>Login</Text>
           </TouchableOpacity>
              
          </View>




          {/* UNDER VIEWBOX */}

          <View style={styles.UVbox}>
            <RectangleIcon />
            <Text style={{paddingLeft: 2, paddingRight: 2}}>Or login with</Text>
            <RectangleIcon />
        
          </View>



          {/* FACEBOOK/GOOGLE BOX */}

          <View style={{marginTop: 55, flexDirection:'row', gap: 30}}>

            <TouchableOpacity style={styles.fgbox}>
              <FacebookIcon />
              <Text>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fgbox2}>
              <GoogleIcon />
              <Text>Google</Text>
            </TouchableOpacity>

          </View>



          {/* REGISTER BOX */}

          <View style={{marginTop: 85, alignSelf: 'flex-start', marginLeft: 18}}>
            <Text style={{fontSize: 14, color:'#292929'}}>Don&apos;t have an account? 
            <Link href={'/registration'} style={{color: '#6734F2'}}> Register</Link></Text>
          </View>






            




        </View>


    )
}

const styles = StyleSheet.create({
    container : {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: '100%'
    },

    WBbox :{
        alignSelf: 'flex-start',
        paddingLeft: 20,
        paddingTop: 80
    },

    Inputbox :{
        display: 'flex',
        alignSelf: 'flex-start',
        paddingTop: 40,
        paddingLeft: 17,
        marginTop: 35
      },
  
      InputContainer1 :{
        borderWidth: 1,
        borderColor: '#c9c9c9',
        borderRadius: 8,
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: 'row',
        alignItems: 'center'
      },
  
      smsicon :{
        marginLeft: 15,
        marginRight: 5
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
        flexDirection: 'row',
        alignItems: 'center'
      },
  
      lockicon:{
        marginLeft: 15,
        marginRight: 5
      },
  
      InputText2: {
        position: 'absolute',
        bottom: 37,
        left: 10,
        color: '#757575',
        backgroundColor: '#ffff',
        paddingLeft: 5,
        paddingRight: 5
      },
  
      InputButton :{
        marginTop: 15,
        backgroundColor: '#6734F2',
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 8
      },

      RPbox:{
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: 'row',
        gap: 80,
        alignItems: 'center'
      },

      UVbox:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        gap: 5
      },

      fgbox :{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c9c9c9',
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 27,
        paddingRight: 27,
        gap: 8,
        borderRadius: 8
      },
  
      fgbox2: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c9c9c9',
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 44,
        paddingRight: 44,
        gap: 8,
        borderRadius: 8
      },


})