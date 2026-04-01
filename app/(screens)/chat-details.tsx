import ChatBubble, { ChatInputToolbar, DayProp } from "@/components/giftedChatProps";
import BackIcon from "@/components/SvgIcons/backIcon";
import CallIcon from "@/components/SvgIcons/callIcon";
import ablyService from "@/services/ablyService";
import messageService from "@/services/messageService";
import userStatus from "@/services/userStatus";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export default function ChatScreen(){
 
    const route = useRouter()

    const [currentUserId, setCurrentUserId] = useState<string>('')
    const [isRecipientOnline, setIsRecipientOnline] = useState(false);

    
    useEffect(()=>{
        const getUserId = async ()=>{
            const userId = await SecureStore.getItemAsync('user_id')
            setCurrentUserId(userId || '')
        }
        getUserId()
    }, [])

  
    const params = useLocalSearchParams();
    
    const conversationId = params.conversationId as string;
    const recipientId = params.recipientId as string;
    const recipientAvatar = params.recipientAvatar as string
    const recipientName = params.recipientName as string;
      
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
  

    // Initialize chat ONLY when currentUserId is available
    useEffect(() => {
      if (!currentUserId) return; // Don't run until we have user ID

      initializeChat();
      loadRecipientStatus();

      // Poll for status every 10 seconds
     const statusInterval = setInterval(() => {
      loadRecipientStatus();
    }, 30000); // Check every 10 seconds
  
      return () => {
        clearInterval(statusInterval)
        ablyService.unsubscribe();
        ablyService.disconnect();
      };
    }, [currentUserId]);



    const loadRecipientStatus = async () => {
      const status = await userStatus.getUserStatus(recipientId);
      setIsRecipientOnline(status.is_online);
  };
  
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
      if (messageData.sender_id === currentUserId) {
        console.log('Skipping own message from Ably');
        return;
      }
    
      const formattedMessage: IMessage = {
        _id: messageData.id,
        text: messageData.message_text || '',
        createdAt: new Date(messageData.created_at),
        user: {
          _id: messageData.sender_id,
          name: recipientName,
        },
        ...(messageData.image_url && { image: messageData.image_url }),
        ...(messageData.audio_url && { audio: messageData.audio_url }),
      };
    
      setMessages((previousMessages) => {
        const exists = previousMessages.some(msg => msg._id === messageData.id);
        if (exists) {
          console.log('Message already exists, skipping:', messageData.id);
          return previousMessages;
        }
        return GiftedChat.append(previousMessages, [formattedMessage]);
      });
    };
  
    // Format backend messages to Gifted Chat format
    const formatMessagesForGiftedChat = (backendMessages: any[]): IMessage[] => {
      return backendMessages.map((msg) => ({
        _id: msg.id,
        text: msg.message_text || '',
        createdAt: new Date(msg.created_at),
        user: {
          _id: msg.sender_id,
          name: msg.sender_name,
          avatar: msg.sender_avatar,
        },
        ...(msg.image_url && { image: msg.image_url }),
        ...(msg.audio_url && { audio: msg.audio_url }),
      }));
    };
  
    // Send message handler

    const onSend = useCallback(async (text: string, imageUri?: string, audioUri?: string, audioDuration?: number) => {
      const tempId = `temp-${Date.now()}`;
      
      const newMessage: IMessage = {
        _id: tempId,
        text: text || (audioUri ? '🎤 Voice message' : ''),
        createdAt: new Date(),
        user: {
          _id: currentUserId,
        },
        pending: true,
        ...(imageUri && { image: imageUri }),
        ...(audioUri && { audio: audioUri }),
      };
    
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [newMessage])
      );
    
      try {
        let imageUrl: string | undefined;
        let audioUrl: string | undefined;
    
        // Upload image if present
        if (imageUri) {
          imageUrl = await messageService.uploadImage(imageUri);
          console.log('Image uploaded:', imageUrl);
        }
    
        // Upload audio if present
        if (audioUri) {
          audioUrl = await messageService.uploadAudio(audioUri);
          console.log('Audio uploaded:', audioUrl);
        }
    
        // Send to backend
        await messageService.sendMessage(conversationId, text, imageUrl, audioUrl, audioDuration);
    
        // Update message to remove pending state
        setMessages((previousMessages) =>
          previousMessages.map(msg => 
            msg._id === tempId 
              ? { 
                  ...msg, 
                  pending: false, 
                  ...(imageUrl && { image: imageUrl }),
                  ...(audioUrl && { audio: audioUrl }),
                }
              : msg
          )
        );
      } catch (error: any) {
        console.error('Error:', error.response?.data);
        Alert.alert('Error', 'Failed to send message');
        
        setMessages((previousMessages) =>
          previousMessages.filter(msg => msg._id !== tempId)
        );
      }
    }, [conversationId, currentUserId]);

    
  

    if(isLoading){
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6734F2" />
        </View>
      );
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

              <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, width: '60%', maxWidth: '60%'}}>
              <Image
                source={{ 
                  uri: recipientAvatar || 'https://via.placeholder.com/50' 
                }}
                style={styles.headerAvatar}
              />
              <View style={{paddingHorizontal: 5}}>
              <Text style={styles.headerName}>{recipientName}</Text>
              <Text style={styles.headerStatus}>
              {isRecipientOnline ? 'Online' : 'Offline'}
               </Text>
               </View>

              </View>

              <TouchableOpacity style={{left: 30}}>
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
          renderBubble={(props)=> <ChatBubble {...props} />}
          renderDay={(props)=> <DayProp {...props} />}
          renderInputToolbar={()=>
           <ChatInputToolbar
            onSend={onSend}
           />}
          isAlignedTop={true}
          messagesContainerStyle={styles.messageContainer}
          renderAvatar={null}
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

    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
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
    },
    headerStatus: {
      fontSize: 11,
      color: '#ddd',
      paddingHorizontal: 2
  },

  typingContainer: {
    paddingLeft: 12,
    paddingBottom: 10,
  },
  typingBubble: {
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#666',
    fontSize: 14,
  },
})