import BackIcon from "@/components/SvgIcons/backIcon";
import CallIcon from "@/components/SvgIcons/callIcon";
import ChatIcon from "@/components/SvgIcons/chatIcon";
import ExportIcon from "@/components/SvgIcons/exportIcon";
import messageService from "@/services/messageService";
import userStatus from "@/services/userStatus";
import { ProductByIdResponse } from "@/types/products";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductViewScreen(){
    const route = useRouter()
    const {product_id} = useLocalSearchParams();
    const apiUrl = `http://192.168.0.134:8080/pointSwapApi/v1/products/${product_id}`;

    const messageApiUrl = `http://192.168.0.134:8080/pointSwapApi/v1/messages`


    
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>('')
    const [size, setSize] = useState<string>('')
    const [firstName, setFirstName]= useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [avatarUrl, setAvatarUrl] = useState<string>('')
    const [loading, setLoading] = useState<boolean>()
    const [sellerID, setSellerId] = useState<string>('')
    const [currentUserID, setCurrentUserID] = useState<string>('')
    const [isSellerOnline, setIsSellerOnline] = useState<boolean>(false);
    const [sellerLastSeen, setSellerLastSeen] = useState<Date | null>(null);  


    useEffect(()=>{
        const getUserID = async ()=>{
            const userID = await SecureStore.getItemAsync('token')
            setCurrentUserID(userID || '')
        }
        getUserID()
    }, [])



    const loadProductData = async () => {
          try{
            setLoading(true)
            const respone = await axios.get<ProductByIdResponse>(apiUrl)
            
            setImageUrls(respone.data.data.photos.map(photo => photo.image_url))
            setTitle(respone.data.data.title)
            setCategory(respone.data.data.category)
            setSize(respone.data.data.estimated_size)
            setFirstName(respone.data.data.sellers.first_name)
            setLastName(respone.data.data.sellers.last_name)
            setAvatarUrl(respone.data.data.sellers.avatar_url)
            setSellerId(respone.data.data.sellers.user_id)

            const status = await userStatus.getUserStatus(
                respone.data.data.sellers.user_id
            )
            setIsSellerOnline(status.is_online)
            setSellerLastSeen(status.last_seen ? new Date(status.last_seen) : null);

          }catch(error){
            console.error("Failed to get product: ", error)
          }finally{
            setLoading(false)
          }
    }

    useEffect(()=>{
        loadProductData()
    }, [])

    const handleMessage = async () => {
        try {
            setLoading(true);
            
            // Create or get conversation
            const conversationId = await messageService.createConversation(sellerID);
            
            // Navigate to chat
            route.push({
                pathname: '/(screens)/chat-details',
                params: {
                    conversationId: conversationId,
                    recipientId: sellerID,
                    recipientName: `${firstName} ${lastName}`,
                    recipientAvatar: avatarUrl,
                    currentUserId: currentUserID,
                },
            });
        } catch (error) {
            console.error('Error opening chat:', error);
            Alert.alert('Error', 'Could not open chat. Please try again.');
        } finally {
            setLoading(false);
        }
    };




    

    if(loading){
        return(
        <View>
            <ActivityIndicator size={'large'}/>
        </View>
        )
    }

    function formatLastSeen(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
    
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'yesterday';
        return `${days}d ago`;
    }






    return(
        <View style={styles.container}>

            <View style={styles.headerContainer}>

                <View style={styles.navigationBox}>
                <TouchableOpacity style={styles.backIcon} onPress={()=> route.back()}>
                <BackIcon color={'#000'} />
                <Text style={{fontSize: 16, fontWeight: 400}}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <ExportIcon />
                </TouchableOpacity>
                </View>
            </View>

            {/* IMAGE BOX */}
            <View style={styles.ImageContainer}>
              <FlatList
               data={imageUrls}
               keyExtractor={(_,index)=> index.toString()}
               horizontal
               showsHorizontalScrollIndicator={false}
               renderItem={({item})=>(
                   <Image source={{uri: item}}
                   style={styles.imagedata}
                   resizeMode="cover"
                   />
               )}
              
              />
            </View>


            {/* DETAILS BOX */}
            <View style={styles.detailsBox}>
              <Text style={{
                fontSize: 24, fontWeight: 600, paddingBottom: 10
                 }}
                >{title}
                </Text>

              <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
              }}>
              <Text style={styles.content}>Category</Text>
               <Text style={styles.contentValue}>{category}</Text>
              </View>

              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <Text style={styles.content}>Size</Text>
                <Text style={styles.contentValue}>{size}</Text>
              </View>

              <View style={styles.rect}></View>
            </View>


            {/* CONTACT BOX */}
            <View style={styles.contactBox}>

                <View style={styles.profileContainer}>
                    {avatarUrl ? (
                        <Image
                        source={{uri: avatarUrl}}
                        style={{width: 50, height: 50, borderRadius: 25}}
                        />
                    ):(
                        <Text>No Image</Text>
                    )}

                    <View>

                      {/* SWAPPERS NAME */}
                 <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 5}}>
                        <Text style={{fontSize: 16, fontWeight: 600}
                         }>{firstName} {lastName}</Text>
                           <View style={{width: 4, height: 4, backgroundColor: '#757575'}}/>
                          {/* Online status text */}
                        {isSellerOnline ? (
                            <Text style={styles.onlineText}>Online</Text>
                        ) : sellerLastSeen ? (
                            <Text style={styles.offlineText}>
                                Last seen {formatLastSeen(sellerLastSeen)}
                            </Text>
                        ) : null}
                        </View>

                        <View style={styles.adbubble}>
                            <Text>active ads</Text>
                        </View>
                    </View>
                </View>

            </View>

            {/* NOTICE MESSAGE */}
            <View style={styles.messageCont}>
                <Text style={{color: '#C99603'}}>*Remember to be respectful and kind when messaging other users. Make this a safe and welcoming community for everyone. Thank you 🫂</Text>
            </View>



            <View style={styles.contactOption}>

                <View style={styles.boxc}>
                <TouchableOpacity style= {styles.contactButton}>
                    <CallIcon color="#6734F2" />
                  <Text style={{fontSize: 14, fontWeight: 600, color: '#6734F2'}}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style= {styles.contactButton2} onPress={handleMessage} disabled={loading}>
                    <ChatIcon />
                  <Text style={{fontSize: 14, fontWeight: 600, color: '#fff'}}>{loading ? 'Loading...': 'Text'}</Text>
                </TouchableOpacity>
                </View>


            </View>
                

            





        </View>
    )
}


const styles = StyleSheet.create({
    container: {
       padding: 0,
       margin: 0,
       alignContent: 'center',
       alignItems: 'center',
       backgroundColor: '#fff',
       height: '100%',
       paddingHorizontal: 13
    },

    headerContainer : {
        height: 90,
        width: '100%',
    },

    navigationBox : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        top: 50
    },

    backIcon:{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7
    },

    ImageContainer: {
        width: '100%',
        height: 210,
        marginTop: 5, 
    },

    imagedata : {
        width: 350,
        height: 200,
        borderRadius: 12,
        marginRight: 10,
        
    },

    detailsBox: {
        width: '100%',
        height: 120,
        marginTop: 10,
    },

    content: {
       fontSize: 14,
       fontWeight: 400,
       color: '#757575',
       paddingVertical: 5
    },

    contentValue: {
        fontSize: 14,
        fontWeight: 400,
        color: '#191919',
        paddingVertical: 5
    },

    rect: {
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: '#E6E6E6',
      width: 360,
      height: 0.1,
      marginVertical: 10
    },

    contactBox :{
        width: '100%',
        height: 100,
        marginTop: 4,
        paddingVertical: 10
    },

    profileContainer: {
        flexDirection: 'row',
        gap: 10
    },

    adbubble:{
       backgroundColor: '#EBEBEB',
       width: 100,
       paddingVertical: 7,
       paddingHorizontal: 10,
       borderRadius: 32,
       marginVertical: 5
    },

    messageCont: {
        width: '100%',
        padding: 20,
        marginTop: 3,
        borderRadius: 2,
        backgroundColor: '#FFFAEB',
        alignSelf: 'center'
    },

    contactOption: {
        width: '100%',
        height: 100,
        marginTop: 10,
        justifyContent : 'center'
    },

    boxc: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    contactButton: {
       backgroundColor: '#E8E1FD',
       borderWidth: 1,
       borderColor: '#D0C0FB',
       borderRadius: 8,
       width: 150,
       padding: 13,
       flexDirection: 'row',
       gap: 8,
       alignItems: 'center',
       justifyContent: 'center'
    },

    contactButton2: {
       backgroundColor: '#6734F2',
       borderRadius: 8,
       width: 150,
       padding: 13,
       flexDirection: 'row',
       gap: 8,
       alignItems: 'center',
       justifyContent: 'center'
    },

    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        borderWidth: 2,
        borderColor: '#fff',
    },
    onlineText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
    },
    offlineText: {
        fontSize: 12,
        color: '#999',
    },



})