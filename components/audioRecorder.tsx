import { Send, X } from '@tamagui/lucide-icons';
import { Audio } from 'expo-av';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AudioRecorderProps {
  onSend: (audioUri: string, duration: number) => void;
  onCancel: () => void;
}

export default function AudioRecorder({ onSend, onCancel }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const durationInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRecording = async () => {
    try {
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Update duration every second
      durationInterval.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording', err);
      alert('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      
      // Clear interval
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }

      // Stop recording
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      
      if (uri) {
        setIsUploading(true);
        await onSend(uri, recordingDuration);
        setRecording(null);
        setRecordingDuration(0);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
    
    setIsRecording(false);
    setRecordingDuration(0);
    onCancel();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-start recording when component mounts
  React.useEffect(() => {
    startRecording();
    
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.recordingBar}>
        <TouchableOpacity onPress={cancelRecording} style={styles.cancelButton}>
          <X size={24} color="#FF3B30" />
        </TouchableOpacity>

        <View style={styles.recordingInfo}>
          {isRecording && (
            <View style={styles.recordingDot} />
          )}
          <Text style={styles.durationText}>
            {formatDuration(recordingDuration)}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={stopRecording} 
          style={styles.sendButton}
          disabled={isUploading || recordingDuration < 1}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Send size={20} color="#fff" />
          )}
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
  },
  recordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  cancelButton: {
    padding: 8,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#6734F2',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});