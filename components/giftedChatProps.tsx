import { SendHorizontal } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Bubble, Composer, Day } from 'react-native-gifted-chat';
import CameraIcon from './SvgIcons/cameraIcon';
import MicIcon from './SvgIcons/micIcon';



interface props {
  onSend: (text: string) => void;
}

export default function ChatBubble(props: any) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#6734F2',
        },
        left: {
          backgroundColor: '#EBEBEB',
        },
      }}
      textStyle={{
        right: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 400
        },
        left: {
          color: '#000',
        },
      }}
    />
  );
}

//Basically for the date style in chat
export function DayProp(props: any){
    return (
       <Day
       {...props}
         wrapperStyle ={{backgroundColor: '#fff'}}
         textProps={{style:{color: '#757575'}}}
       />
    )
}




export function ChatComposer(props: any) {
    return (
      <Composer
        {...props}
        textInputStyle={{
          backgroundColor: '#f5f5f5',
          borderRadius: 25,
          paddingHorizontal: 15,
          paddingVertical: 8,
          marginRight: 5,
          color: 'black',
          fontSize: 15,
        }}
      />
    );
}

export function ChatInputToolbar({onSend}: props) {



  const handleSend = () => {
    if (text.trim().length === 0) return;
    onSend(text.trim());
    setText('');
  };

    const [text, setText] = useState('');
  
    return (
      <View style={styles.container}>
        <View style={styles.inputRow}>
          {/* Text Input */}
          <TextInput
            style={styles.input}
            placeholder="Aa"
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            multiline
          />

          {/* Show send button only when typing */}
          {text.trim().length > 0 && (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <SendHorizontal color={'white'} />
            </TouchableOpacity>
          )}
  
        </View>

        <View style={styles.icons}>
          <TouchableOpacity style={styles.iconButton}>
            <CameraIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MicIcon />
          </TouchableOpacity>
        </View>

      </View>
    );

}


const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
      paddingHorizontal: 12,
      paddingVertical: 30,
      paddingBottom: Platform.OS === 'ios' ? 15 : 15, // Handles bottom safe area
      flexDirection: 'row',
      alignItems: 'center'
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 25,
      paddingHorizontal: 15,
      paddingVertical: 6,
      bottom: 15,
      width: '75%',
      maxWidth: '75%',
      borderWidth: 1,
      borderColor: '#E6E6E6'
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: '#000',
      maxHeight: 100, // Limits multiline growth
      paddingVertical: 4,
    },
    icons: {
      flexDirection: 'row',
      alignItems: 'center',
      bottom: 15
    },
    iconButton: {
      paddingHorizontal: 5,
    },
    sendButton: {
      backgroundColor: '#6734F2',
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
    },
  });