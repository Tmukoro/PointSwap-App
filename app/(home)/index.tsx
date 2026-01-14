import FlagWomanIcon from "@/components/SvgIcons/flagwoman";
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";






export default function WelcomeScreen (){
  const route = useRouter();


  return(

    

    <View style={styles.container}>

      <View style={{marginTop: 160}}>
        <FlagWomanIcon />
      </View>


      <View style={styles.Welcomebox}>

        <Text style={{fontSize: 24, fontWeight: 'bold', marginTop: 30, paddingLeft: 21}}>Welcome to Pointswap 👋</Text>

        <View style={{marginTop: 8, width: 340, marginLeft: 21 }}>
        <Text style={{fontSize: 16, color: '#292929'}}>Chat, link, and easily swap NYSC items with other camp members!</Text>
        </View>


        <TouchableOpacity style={styles.regbutton} onPress={()=> route.navigate('/registration')}>
          <Text style={{color: 'white', fontSize: 14, fontWeight: '600'}}>Register</Text>
        </TouchableOpacity>

        <Text style={{paddingLeft: 26, marginTop: 55, fontSize: 14}}>Already have an account?  
        <Link href={'/login'} style={{color: '#6734F2'}}> Login</Link>
        </Text>
        


      </View>

    







      
    </View>

    





  )




}



const styles = StyleSheet.create({
  container :{
    display: 'flex',
    alignItems:'center',
    padding: 0,
    margin: 0,
    height: '100%',
    backgroundColor: '#ffff'
  },

  Welcomebox :{
    marginTop: 60,
    height: '100%',
    width: '100%',
    borderRadius: 25,
    backgroundColor: 'white',
    borderColor: '#ffff',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: -4},
    shadowRadius: 13,
    shadowOpacity: 0.25,
    elevation: 7
  },

  regbutton: {
    marginTop: 55,
    backgroundColor: '#6734F2',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 145,
    paddingRight: 145,
    borderRadius: 8,
    alignSelf: 'center'
  }
})