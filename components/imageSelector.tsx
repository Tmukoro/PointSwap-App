import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import CheckIcon from './SvgIcons/checkIcon';
import UploadIcon from './SvgIcons/UplaodIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_SIZE = 65;
const ITEM_GAP = 8;
const MAX_IMAGES = 4;

// Full screen preview modal
const PreviewModal = ({
  visible,
  images,
  initialIndex,
  onClose,
}: {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  React.useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
      }, 50);
    }
  }, [visible, initialIndex]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.previewOverlay}>
        <TouchableOpacity style={styles.previewClose} onPress={onClose}>
          <Text style={styles.previewCloseText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.previewCounter}>
          <Text style={styles.previewCounterText}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(newIndex);
          }}
          renderItem={({ item }) => (
            <View style={styles.previewImageContainer}>
              <Image source={{ uri: item }} style={styles.previewImage} resizeMode="contain" />
            </View>
          )}
        />

        <View style={styles.dotContainer}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>
      </View>
    </Modal>
  );
};

// Single draggable image item with its own PanResponder
const DraggableImage = ({
  uri,
  index,
  isFirst,
  totalImages,
  onReorder,
  onPress,
  onDragStateChange,
}: {
  uri: string;
  index: number;
  isFirst: boolean;
  totalImages: number;
  onReorder: (from: number, to: number) => void;
  onPress: (index: number) => void;
  onDragStateChange: (dragging: boolean) => void;
}) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const isDragging = useRef(false);
  const isDraggingShared = useSharedValue(0); // 0 = false, 1 = true

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
    zIndex: isDraggingShared.value === 1 ? 10 : 1,
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // Steal the gesture from ScrollView if moving horizontally
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 5 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        isDragging.current && Math.abs(gestureState.dx) > 5,
      onPanResponderGrant: () => {
        isDragging.current = false;
      },
      onPanResponderMove: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > 8) {
          if (!isDragging.current) {
            isDragging.current = true;
            isDraggingShared.value = 1;
            scale.value = withSpring(1.1);
            onDragStateChange(true);
          }
          translateX.value = gestureState.dx;
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isDragging.current) {
          const toIndex = Math.max(
            0,
            Math.min(
              totalImages - 1,
              index + Math.round(gestureState.dx / (ITEM_SIZE + ITEM_GAP))
            )
          );

          if (toIndex !== index) {
            onReorder(index, toIndex);
          }

          scale.value = withSpring(1);
          translateX.value = withSpring(0);
          isDragging.current = false;
          isDraggingShared.value = 0;
          onDragStateChange(false);
        } else {
          // Tap — no significant drag happened
          onPress(index);
        }
      },
      onPanResponderTerminate: () => {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        isDragging.current = false;
        isDraggingShared.value = 0;
        onDragStateChange(false);
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.imageWrapper, animStyle]} {...panResponder.panHandlers}>
      <Image source={{ uri }} style={styles.thumbnail} />
      {isFirst && (
        <View style={styles.checkBadge}>
          <CheckIcon style={{ width: 14, height: 14 }} />
        </View>
      )}
    </Animated.View>
  );
};

interface ImageSelectorProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onPickImage: () => void;
  uploading?: boolean;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  onImagesChange,
  onPickImage,
  uploading,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleReorder = useCallback(
    (from: number, to: number) => {
      const newImages = [...images];
      const [moved] = newImages.splice(from, 1);
      newImages.splice(to, 0, moved);
      onImagesChange(newImages);
    },
    [images, onImagesChange]
  );

  const handlePress = useCallback((index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  }, []);

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <View>
      <View style={styles.container}>
        {canAddMore && (
          <UploadIcon onPress={uploading ? undefined : onPickImage} />
        )}

        {images.map((uri, index) => (
          <DraggableImage
            key={uri + index}
            uri={uri}
            index={index}
            isFirst={index === 0}
            totalImages={images.length}
            onReorder={handleReorder}
            onPress={handlePress}
            onDragStateChange={() => {}}
          />
        ))}

        {Array.from({
          length: Math.max(0, MAX_IMAGES - images.length - (canAddMore ? 1 : 0)),
        }).map((_, i) => (
          <View key={`slot-${i}`} style={styles.emptySlot} />
        ))}
      </View>

      <PreviewModal
        visible={previewVisible}
        images={images}
        initialIndex={previewIndex}
        onClose={() => setPreviewVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ITEM_GAP,
    height: ITEM_SIZE + 20,
    marginTop: 8,
  },
  imageWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 10,
    position: 'relative',
  },
  thumbnail: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 10,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBadge: {
    position: 'absolute',
    bottom: -18,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleBadgeText: {
    fontSize: 9,
    color: '#6734F2',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptySlot: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
  },
  hint: {
    fontSize: 11,
    color: '#999',
    marginTop: 14,
  },
  maxNotice: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 6,
    fontWeight: '500',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewCounter: {
    position: 'absolute',
    top: 58,
    alignSelf: 'center',
    zIndex: 10,
  },
  previewCounterText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  previewImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
  },
  dotContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 18,
  },
});

export default ImageSelector;