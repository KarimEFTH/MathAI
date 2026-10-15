// ============================================
// 📁 EMPLACEMENT : src/screens/OnboardingScreen.tsx
// 🎉 Rôle : Écran d'accueil (première ouverture)
//    Comme dans Homework AI — 3 pages swipables
// ============================================

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../theme';

const { width, height } = Dimensions.get('window');

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    id: '1',
    emoji: '📸',
    title: 'Photographie ton exercice',
    subtitle:
      'Prends simplement une photo de ton problème de maths et l\'AI le détecte automatiquement.',
    color: '#6C5CE7',
    bgEmojis: ['📐', '📏', '✏️', '📓'],
  },
  {
    id: '2',
    emoji: '🧠',
    title: 'L\'AI résout pour toi',
    subtitle:
      'GPT-4 analyse ton problème et te donne la solution complète avec toutes les étapes détaillées.',
    color: '#00D2FF',
    bgEmojis: ['🔢', '➕', '✖️', '➗'],
  },
  {
    id: '3',
    emoji: '📚',
    title: 'Apprends étape par étape',
    subtitle:
      'Comprends chaque étape de la résolution. Sauvegarde tes exercices et progresse en maths !',
    color: '#00B894',
    bgEmojis: ['🏆', '⭐', '🎯', '💡'],
  },
];

const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false },
  );

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => {
    return (
      <View style={[styles.slide, { width }]}>
        {/* Background floating emojis */}
        <View style={styles.bgEmojisContainer}>
          {item.bgEmojis.map((emoji, i) => (
            <Text
              key={i}
              style={[
                styles.bgEmoji,
                {
                  top: 60 + (i * 90),
                  left: i % 2 === 0 ? 20 + (i * 15) : width - 70 - (i * 10),
                  opacity: 0.12,
                  fontSize: 36 + (i * 4),
                  transform: [{ rotate: `${-15 + i * 20}deg` }],
                },
              ]}>
              {emoji}
            </Text>
          ))}
        </View>

        {/* Main content */}
        <View style={styles.slideContent}>
          {/* Big emoji icon */}
          <View style={[styles.emojiCircle, { backgroundColor: item.color + '20' }]}>
            <View style={[styles.emojiInnerCircle, { backgroundColor: item.color + '15' }]}>
              <Text style={styles.mainEmoji}>{item.emoji}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.slideTitle}>{item.title}</Text>

          {/* Subtitle */}
          <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Skip button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
      />

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((slide, index) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });

            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: slide.color,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: slides[currentIndex].color },
          ]}
          activeOpacity={0.85}
          onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Commencer 🚀' : 'Suivant →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Skip
  skipButton: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  // Slide
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgEmojisContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bgEmoji: {
    position: 'absolute',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emojiCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emojiInnerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainEmoji: {
    fontSize: 64,
  },
  slideTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  // Bottom
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 50,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    width: '100%',
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;