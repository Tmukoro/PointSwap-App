import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import messageService from "@/services/messageService";
import { Conversation } from "@/types/message";
import { useFocusEffect } from "@react-navigation/native";

export default function ChatScreen (){

    const router = useRouter();

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setIsloading] = useState(true)

    const loadConversations = async()=>{
        try{
            const data = await messageService.getConversations()
            setConversations(data)
            setIsloading(false)
        } catch(error){
            console.error("Error loading conversations: ", error)
            setIsloading(false)
        }
    }



    useFocusEffect(()=>{
        loadConversations();
    },)

    

    const openChat  = (conversation: Conversation) => {
        router.push({
            pathname: '/(screens)/chat-details' ,
            params: {
                conversationId: conversation.id,
                recipientId: conversation.other_user_id,
                recipientName: conversation.other_user_name,
                recipientAvatar : conversation.other_user_avatar || ''
            }
        })
    }


    const renderConversation = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
          style={styles.conversationItem}
          onPress={() => openChat(item)}
        >
          <Image
            source={{ uri: item.other_user_avatar || 'https://via.placeholder.com/50' }}
            style={styles.avatar}
          />
          <View style={styles.conversationInfo}>
            <View style={styles.headerRow}>
              <Text style={styles.userName}>{item.other_user_name}</Text>
              {item.unread_count > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread_count}</Text>
                </View>
              )}
            </View>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.last_message_text || 'No messages yet'}
            </Text>
          </View>
        </TouchableOpacity>
      );
    
      if (loading) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6734F2" />
          </View>
        );
      }





    return(
        <View style={styles.container}>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No conversations yet</Text>
          </View>
        }
      />
        
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor: '#fff'
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
      },
      conversationItem: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        display: 'flex'
      },
      avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
      },
      conversationInfo: {
        flex: 1,
        justifyContent: 'center',
      },
      headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
      },
      userName: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      lastMessage: {
        fontSize: 14,
        color: '#666',
      },
      unreadBadge: {
        backgroundColor: '#6734F2',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        top: 8
      },
      unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
      },


})