import ItemBox from "@/components/itemBox";
import SortIcon from "@/components/SvgIcons/sortIcon";
import { FeedItem, FeedResponse } from "@/types/products";
import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ThirdRoute  () {
    const route = useRouter()
    const apiUrl = "http://192.168.0.134:8080/pointSwapApi/v1/products?category=Shoes";

    const [feedData, setFeedData] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeed = async (): Promise<void> => {
        try{
            setLoading(true)
            const token = await SecureStore.getItemAsync('token')
            const response = await axios.get<FeedResponse>(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFeedData(response.data.data.items);
            setError(null)
        } catch(err){
            console.error(err)
            setError("Faile to load feed")
        } finally{
            setLoading(false)
        }
    };

    useEffect(()=>{
        fetchFeed();
    }, []);

    const handlePress = (productID: string)=>{
        route.push({
           pathname: '/(tabs)/productView',
           params: {product_id: productID}
        })
        
    };

    if(loading){
        return(
            <View>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }


    return(
        <View style={{ flex: 1, backgroundColor: 'white' }}>

            {/* Sortbutton box area */}

            <View style={styles.sortbox}>
                <Text style={{fontSize: 16, fontWeight: 600, paddingLeft: 14}}>Recently added</Text>
                <TouchableOpacity style={styles.sortbutton}>
                <Text style={{color: '#6734F2', fontSize: 14, fontWeight: 600}}>Sort by</Text>
                <SortIcon />
                </TouchableOpacity>
            </View>

            <View style={styles.itemBox}>
                
                <FlatList
                 data={feedData}
                 keyExtractor={(item)=> item.product_id}
                 renderItem={({item})=>(
                    <ItemBox
                       title={item.title}
                       estimated_size={item.estimated_size}
                       image_url={item.image_url}
                       onPress={()=>handlePress(item.product_id)}     
                    />
                 )}
                 refreshing={loading}
                 onRefresh={fetchFeed}
                />

            </View>


        

        </View>

    );  
}


const styles = StyleSheet.create({
    sortbox:{
        maxWidth: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 15
    },

    sortbutton : {
      paddingRight: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3
    },

    itemBox : {
        height: '100%',
    },


})



