import ChatBubble, { ChatInputToolbar, DayProp } from "@/components/giftedChatProps";
import BackIcon from "@/components/SvgIcons/backIcon";
import CallIcon from "@/components/SvgIcons/callIcon";
import ablyService from "@/services/ablyService";
import messageService from "@/services/messageService";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function ChatScreen(){
 
    const route = useRouter()

    const [currentUserID, setCurrentUserID] = useState<string>('')
    
    useEffect(()=>{
        const getUserId = async ()=>{
            const userId = await SecureStore.getItemAsync('user_id')
            setCurrentUserID(userId || '')
        }
        getUserId()
    }, [])

    const params = useLocalSearchParams();
    
    const conversationId = params.conversationId as string;
    const recipientId = params.recipientId as string;
    const recipientAvatar = params.recipientAvatar as string
    const recipientName = params.recipientName as string;
    
    const currentUserId = currentUserID;
    
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      initializeChat();
  
      return () => {
        // Cleanup when leaving screen
        ablyService.unsubscribe();
        ablyService.disconnect();
      };
    }, []);
  
    const initializeChat = async () => {
      try {
        
        // 1. Connect to Ably
        await ablyService.connect();
        
        // 2. Load message history
        const messageHistory = await messageService.getMessages(conversationId);
        
        // 3. Convert to Gifted Chat format
        const formattedMessages = formatMessagesForGiftedChat(messageHistory);
        setMessages(formattedMessages);
        
        // 4. Subscribe to new messages
        ablyService.subscribeToConversation(conversationId, handleNewMessage);
        
        // 5. Mark as read
        await messageService.markAsRead(conversationId);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsLoading(false);
      }
    };
  
    // Handle new messages from Ably
    const handleNewMessage = (messageData: any) => {
      // Don't add if it's from current user (already added optimistically)
      if (messageData.sender_id === currentUserId) {
        return;
      }
  
      const formattedMessage: IMessage = {
        _id: messageData.id,
        text: messageData.message_text,
        createdAt: new Date(messageData.created_at),
        user: {
          _id: messageData.sender_id,
          name: recipientName,
        },
      };
  
      setMessages((previousMessages) => {
        // Check if message already exists
        const exists = previousMessages.some(msg => msg._id === messageData.id);
        if (exists) return previousMessages;
        
        return GiftedChat.append(previousMessages, [formattedMessage]);
      });
    };
  
    // Format backend messages to Gifted Chat format
    const formatMessagesForGiftedChat = (backendMessages: any[]): IMessage[] => {
      return backendMessages.map((msg) => ({
        _id: msg.id,
        text: msg.message_text,
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.sender_id,
          name: msg.sender_name,
          avatar: msg.sender_avatar,
        },
      }));
    };
  
    // Send message handler

    const onSend = useCallback(async (text: string) => {
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: text,
        createdAt: new Date(),
        user: {
          _id: currentUserId,
        },
      };
    
      try {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [newMessage])
        );
        await messageService.sendMessage(conversationId, text);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }, [conversationId, currentUserId]);


    if(isLoading){
      return <ActivityIndicator size={'large'} />
    }
  
    return (

      <>

            <View style={styles.headerContainer}>

              <View style={styles.profileContainer}>
              <TouchableOpacity
               style={{left: 18, width: 20, height: 20}}
                onPress={()=> route.push('/(tabs)/chat')}
               >
                <BackIcon />
              </TouchableOpacity>

              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Image
                source={{ 
                  uri: recipientAvatar || 'https://via.placeholder.com/50' 
                }}
                style={styles.headerAvatar}
              />
              <Text style={styles.headerName}>{recipientName}</Text>
              </View>

              <TouchableOpacity style={{left: 130}}>
                <CallIcon />
              </TouchableOpacity>
              </View>


            </View>


      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 5}
       >
      
        <GiftedChat
          messages={messages}
          user={{
            _id: currentUserId,
          }}
          isTyping = {false}
          reply={{
            swipe: {
              isEnabled: true,
              direction: 'left',
            }
          }}
          renderBubble={(props)=> <ChatBubble {...props} />}
          renderDay={(props)=> <DayProp {...props} />}
          renderInputToolbar={()=> <ChatInputToolbar onSend={onSend} />}
          isAlignedTop={true}
          messagesContainerStyle={styles.messageContainer}
        />

        </KeyboardAvoidingView>

      </>
    );
  }
  


const styles = StyleSheet.create({
    container: {
        flex: 1,
       backgroundColor: '#fff'
    },

    headerContainer: {
      height: 110,
      backgroundColor: '#6734F2',
    },

    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
      paddingTop: 60      
    },

    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    headerName: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    messageContainer :{
      backgroundColor: '#fff'
    }
})