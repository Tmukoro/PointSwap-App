import { SendHorizontal, X } from '@tamagui/lucide-icons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, Image, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Bubble, Composer, Day } from 'react-native-gifted-chat';
import CameraIcon from './SvgIcons/cameraIcon';
import MicIcon from './SvgIcons/micIcon';
import AudioRecorder from './audioRecorder';
import VoiceNoteBubble from './voiceNoteBubble';



interface props {
  onSend: (text: string, imageUri?:string, audioUri?: string, audioDuration?: number) => void;
}

export default function ChatBubble(props: any) {
  const { currentMessage } = props;
  const [showImageModal, setShowImageModal] = useState(false);
  const userId = SecureStore.getItemAsync("user_id")

   // If it's a voice note, render custom bubble
   if (currentMessage.audio) {
    const isSender = currentMessage.user._id === userId;
    
    return (
      <View style={{ marginHorizontal: 10, marginVertical: 5 }}>
        <VoiceNoteBubble
          audioUrl={currentMessage.audio}
          isPending={currentMessage.pending}
          isSender={isSender}
        />
      </View>
    );
  }

  return (
    <View>
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6734F2',
            marginRight: 13,
            opacity: currentMessage.pending ? 0.6 : 1,
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
        renderMessageImage={() => {
          if (!currentMessage.image) return null;
          
          return (
            <>
              <TouchableOpacity onPress={() => setShowImageModal(true)}>
                <Image
                  source={{ uri: currentMessage.image }}
                  style={styles.messageImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {/* Full screen image modal */}
              <Modal
                visible={showImageModal}
                transparent={true}
                onRequestClose={() => setShowImageModal(false)}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowImageModal(false)}
                  >
                    <X size={30} color="#fff" />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: currentMessage.image }}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                </View>
              </Modal>
            </>
          );
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

export function ChatInputToolbar({onSend}: props) {

  const handleSend = () => {
    if (text.trim().length === 0 && !selectedImage) return;
    onSend(text.trim(), selectedImage || undefined);
     setText('');
    setSelectedImage(null);
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to send images');
      return;
    }
  
    // Launch image picker with camera option
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });
  
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  

    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    
  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleAudioSend = (audioUri: string, duration: number) => {
    onSend('', undefined, audioUri, duration);
    setIsRecording(false);
  };

    // Show audio recorder when recording
    if (isRecording) {
      return (
        <AudioRecorder
          onSend={handleAudioSend}
          onCancel={() => setIsRecording(false)}
        />
      );
    }
  



  
    return (
      <View style={styles.container}>

            {/* Image preview */}
            {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          <TouchableOpacity 
            style={styles.removeImageButton}
            onPress={() => setSelectedImage(null)}
          >
            <X size={16} color="#fff" />
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

{(text.trim().length > 0 || selectedImage) && (
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSend}
              disabled={isUploading}
            >
            <SendHorizontal color={'white'} size={'$1'} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.icons}>

         {/* CAMERA FUNCTION ICON */}   
          <TouchableOpacity
          style={styles.iconButton}
          onPress={pickImage}
          disabled={isUploading}
          >
            <CameraIcon />
          </TouchableOpacity>
          

          <TouchableOpacity style={styles.iconButton}
            onPress={() => setIsRecording(true)}
            disabled={isUploading}
          >
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


  imagePreviewContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 17,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 7,
    marginBottom: 3
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },

  fullImage: {
    width: '100%',
    height: '100%'
  },
});