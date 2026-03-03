import { CircleX, SendHorizontal } from '@tamagui/lucide-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Bubble, Composer, Day, IMessage } from 'react-native-gifted-chat';
import CameraIcon from './SvgIcons/cameraIcon';
import MicIcon from './SvgIcons/micIcon';



interface props {
  onSend: (text: string) => void;
  replyMessage?: IMessage | null;
  onCancelReply?: () => void;
  onTyping : (isTyping: boolean) => void
}

export default function ChatBubble(props: any) {
  const {currentMessage} = props
  return (
    <View>
    {/* Show replied message if exists */}
    {currentMessage.replyTo && (
      <View style={[
        styles.replyPreview,
        currentMessage.user._id === props.user._id 
          ? styles.replyPreviewRight 
          : styles.replyPreviewLeft
      ]}>
        <Text style={styles.replyText} numberOfLines={1}>
          {currentMessage.replyTo.text}
        </Text>
      </View>
    )}


    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#6734F2',
          marginRight: 13
        },
        left: {
          backgroundColor: '#EBEBEB',
          marginLeft: 12
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

    </View>
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

export function ChatInputToolbar({onSend, replyMessage, onCancelReply, onTyping}: props) {

  const handleSend = () => {
    if (text.trim().length === 0) return;
    if (onTyping) {
      onTyping(false);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onSend(text.trim());
    setText('');
  };

    const [text, setText] = useState('');
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> |null>(null);

  const handleTextChange = (newText: string) => {
    setText(newText);

    // Emit typing event
    if (onTyping) {
      onTyping(true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  
    return (
      <View style={styles.container}>
      {/* Reply Preview - positioned above the input row */}
      {replyMessage && (
        <View style={styles.replyContainer}>
          <View style={styles.replyContent}>
            <Text style={styles.replyLabel}>Replying to</Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyMessage.text}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelReply} style={styles.cancelButton}>
            <CircleX size={'$1'} />
          </TouchableOpacity>
        </View>
      )}

      {/* Input and icons row */}
      <View style={styles.bottomRow}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Aa"
            placeholderTextColor="#999"
            value={text}
            onChangeText={handleTextChange}
            multiline
          />

          {text.trim().length > 0 && (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <SendHorizontal color={'white'} size={'$1'} />
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
    </View>
    );

}







const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 25 : 25,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 3,
    borderLeftColor: '#757575',
    padding: 8,
    marginBottom: 10,
    borderRadius: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 14,
    color: '#333',
  },
  cancelButton: {
    padding: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 6,
    width: '75%',
    maxWidth: '75%',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    maxHeight: 100,
    paddingVertical: 4,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 2
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

  replyPreview: {
    backgroundColor: '#f0f0f0',
    padding: 6,
    marginHorizontal: 10,
    marginBottom: -8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#757575',
    marginTop: 6,
  },
  replyPreviewRight: {
    marginLeft: 50,
  },
  replyPreviewLeft: {
    marginRight: 50,
  },
});