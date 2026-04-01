import { Pause, Play } from '@tamagui/lucide-icons';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VoiceNoteBubbleProps {
  audioUrl: string;
  duration?: number;
  isPending?: boolean;
  isSender?: boolean;
}

export default function VoiceNoteBubble({ audioUrl, duration, isPending, isSender }: VoiceNoteBubbleProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(duration ? duration * 1000 : 0);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playSound = async () => {
    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        
        // If finished or at the end, reload completely
        if (status.isLoaded && (status.didJustFinish || (status.durationMillis && status.positionMillis >= status.durationMillis - 100))) {
          await sound.unloadAsync();
          // Create new sound instance
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );
          setSound(newSound);
          setIsPlaying(true);
          setPlaybackPosition(0);
        } else if (status.isLoaded) {
          // Resume if paused
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Load and play for the first time
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis || playbackDuration);
  
      if (status.didJustFinish) {
        setIsPlaying(false);
        // Don't reset position here, let the play button handle it
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (isPending) {
    return (
      <View style={[styles.container, isSender ? styles.senderContainer : styles.receiverContainer]}>
        <ActivityIndicator color={isSender ? '#fff' : '#000'} />
        <Text style={[styles.timeText, isSender && styles.senderText]}>Uploading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isSender ? styles.senderContainer : styles.receiverContainer]}>
      <TouchableOpacity 
        onPress={isPlaying ? pauseSound : playSound}
        style={styles.playButton}
      >
        {isPlaying ? (
          <Pause size={24} color={isSender ? '#fff' : '#6734F2'} />
        ) : (
          <Play size={24} color={isSender ? '#fff' : '#6734F2'} />
        )}
      </TouchableOpacity>

      <View style={styles.waveform}>
        <View style={[
          styles.progressBar, 
          { width: `${(playbackPosition / playbackDuration) * 100}%` },
          isSender ? styles.senderProgress : styles.receiverProgress
        ]} />
      </View>

      <Text style={[styles.timeText, isSender && styles.senderText]}>
        {formatTime(isPlaying ? playbackPosition : playbackDuration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 18,
    minWidth: 200,
    gap: 10,
  },
  senderContainer: {
    backgroundColor: '#6734F2',
  },
  receiverContainer: {
    backgroundColor: '#EBEBEB',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  senderProgress: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  receiverProgress: {
    backgroundColor: '#6734F2',
  },
  timeText: {
    fontSize: 12,
    color: '#000',
    minWidth: 40,
  },
  senderText: {
    color: '#fff',
  },
});