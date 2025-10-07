import LockIcon from "@/components/SvgIcons/LockIcon";
import SmsIcon from "@/components/SvgIcons/SmsIcon";
import AppleIcon from "@/components/SvgIcons/appleIcon";
import FacebookIcon from "@/components/SvgIcons/facebookIcon";
import GoogleIcon from "@/components/SvgIcons/googleIcon";
import RectangleIcon from "@/components/rectangle";


import { useRouter } from "expo-router";
import React from "react";
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegistrationScreen (){

    const router = useRouter();
    return(

        <View style={styles.container}>

          {/* GET STARTED SECTION */}

            <View style={styles.GSbox}>

                
                <Text style={{fontSize: 24, fontWeight: 'bold', color:'#292929'}}>Get Started</Text>
                <Text style={{fontSize: 16, color: '#292929'}}>How would you prefer to sign up?</Text>

            </View>



            {/* INPUT BOX */}

            <View style={styles.Inputbox}>
     
            <View style={styles.InputContainer1}>
            <Text style={styles.InputText1}>Email</Text>
            <SmsIcon style={styles.smsicon} />
            <TextInput style={{width: '82%'}} placeholder="Emmanuel6@gmail.com"></TextInput>
            </View>


           <View style={styles.InputContainer2}>
           <Text style={styles.InputText2}>Password</Text>
           <LockIcon style={styles.lockicon} />
           <TextInput placeholder="•••••••••••••" secureTextEntry = {true} style={{fontWeight: 'bold', width:'82%'}}></TextInput>
           </View>
           
           <TouchableOpacity style={styles.InputButton} onPress={()=> router.navigate('/location')}>
            <Text style={{textAlign: 'center', color: 'white'}}>Continue with email</Text>
           </TouchableOpacity>
              
          </View>




          {/* UNDER VIEWBOX */}

          <View style={styles.UVbox}>
            <RectangleIcon />
            <Text style={{paddingLeft: 2, paddingRight: 2}}>Or register with</Text>
            <RectangleIcon />
        
          </View>



          {/* APPLE BOX */}

          <View style={{marginTop: 50}}>

            <TouchableOpacity style={styles.applebox}>
              <AppleIcon style={{marginRight: 6}} />
              <Text style={{paddingTop: 2, color: '#292929', fontWeight: '400'}}>Continue wih Apple</Text>
            </TouchableOpacity>

          </View>



          {/* FACEBOOK/GOOGLE BOX */}

          <View style={{marginTop: 15, flexDirection:'row', gap: 30}}>

            <TouchableOpacity style={styles.fgbox}>
              <FacebookIcon />
              <Text>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fgbox2}>
              <GoogleIcon />
              <Text>Google</Text>
            </TouchableOpacity>

          </View>


          {/* TOS BOX */}

          <View style={{marginTop: 55, width: 345}}>
            <Text style={{color: '#292929', fontWeight: '400'}}>By continuing, you acknowledge that you have read and understood, 
            and agree to Pointswaps <Text onPress={()=> Linking.openURL('www.example.com')} style={styles.tostxt}>
            Terms of Service</Text> and <Text onPress={()=> Linking.openURL} style={styles.tostxt}>Privacy Policy</Text>.
            </Text>
            
          </View>



          










        </View>


    )
}

const styles = StyleSheet.create({
    container : {
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        backgroundColor: '#ffff',
        height: '100%'
    },

    GSbox :{
      display: 'flex',
      alignSelf: 'flex-start',
      outline: '1px solid',
      paddingTop: 85,
      paddingLeft: 20
    },

    Inputbox :{
      display: 'flex',
      alignSelf: 'flex-start',
      outline: '1px solid',
      paddingTop: 50,
      paddingLeft: 17,
      marginTop: 24
    },

    InputContainer1 :{
      borderWidth: 1,
      borderColor: '#c9c9c9',
      borderRadius: 8,
      paddingRight: 10,
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
      paddingRight: 10,
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

    UVbox :{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 50,
      gap: 5
    },
    
    applebox :{
      flexDirection: 'row', 
      alignItems:'center',
      borderWidth: 1,
      borderColor: '#c9c9c9',
      paddingTop: 14,
      paddingBottom: 14,
      paddingLeft: 95,
      paddingRight: 95,
      borderRadius: 8,
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

    tostxt :{
      color: '#6734F2',
      textDecorationLine: 'underline'
    }
})