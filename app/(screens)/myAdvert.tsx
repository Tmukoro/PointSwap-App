import ItemBox from "@/components/itemBox";
import BackIcon from "@/components/SvgIcons/backIcon";
import myAdvert from "@/services/myAdvert";
import { FeedItem } from "@/types/products";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function MyAdvertScreem(){
    const route = useRouter()
    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true)

    const fetchFeed = async ()=>{
        try{
            setLoading(true)
            const data = await myAdvert.getUsersProducts()
            setFeedData(data)
            setLoading(false)
        } catch(error){
            console.error("Error loading User Products", error)
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchFeed()
    }, [])

    if(loading){
        return(
            <View>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    const handlePress =()=>{
        console.log('pressed')
    }
   

    return(
        <View style={styles.container}>

<View style={styles.headerContainer}>

<View style={styles.navigationBox}>
<TouchableOpacity style={styles.backIcon} onPress={()=> route.back()}>
<BackIcon color={'#000'} />
<Text style={{fontSize: 16, fontWeight: 400}}>Back</Text>
</TouchableOpacity>
</View>
</View>


      <FlatList
              data={feedData}
              keyExtractor={(item)=> item.product_id}
              renderItem={({item})=> (
                <ItemBox
                  title={item.title}
                  estimated_size={item.estimated_size}
                  image_url={item.image_url}
                   onPress={handlePress}
                />
              )}
              refreshing={loading}
              onRefresh={fetchFeed}
              />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
       padding: 0,
       margin: 0,
       alignContent: 'center',
       backgroundColor: '#fff',
       flex: 1
    },

    headerContainer : {
        height: 90,
        width: '100%',
    },

    navigationBox : {
        justifyContent: 'flex-start',
        top: 50,
        paddingHorizontal: 15
    },
    
    backIcon:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        top: 2
    },
})