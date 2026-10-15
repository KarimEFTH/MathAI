// ============================================
// 📁 EMPLACEMENT : src/screens/CameraScreen.tsx
// 📸 VERSION EXPO — Utilise expo-image-picker au lieu de react-native-image-picker
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '../theme';
import { solveMathProblem } from '../services/AIService';
import { saveProblem } from '../services/StorageService';
import { MathProblem } from '../types';
import { generateId } from '../utils/helpers';
import GradientButton from '../components/GradientButton';
import LoadingAnimation from '../components/LoadingAnimation';

const CameraScreen = ({ navigation }: any) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ===== PRENDRE UNE PHOTO (Expo) =====
  const handleTakePhoto = async () => {
    // Demander la permission caméra
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'L\'accès à la caméra est nécessaire pour prendre des photos.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ===== CHOISIR DEPUIS LA GALERIE (Expo) =====
  const handlePickImage = async () => {
    // Demander la permission galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'L\'accès à la galerie est nécessaire.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ===== ANALYSER L'IMAGE AVEC L'AI =====
  const handleAnalyze = async () => {
    if (!imageUri) return;

    setIsAnalyzing(true);
    try {
      const result = await solveMathProblem(imageUri);

      if (!result.success) {
        Alert.alert('Erreur', result.error || 'Impossible d\'analyser l\'image.');
        setIsAnalyzing(false);
        return;
      }

      const problem: MathProblem = {
        id: generateId(),
        imageUri: imageUri,
        question: result.question,
        solution: result.solution,
        steps: result.steps,
        category: result.category,
        difficulty: result.difficulty,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      await saveProblem(problem);
      navigation.replace('Solution', { problem });
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImageUri(null);
  };

  // ===== ÉTAT : ANALYSE EN COURS =====
  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <LoadingAnimation message="Analyse du problème..." />
      </View>
    );
  }

  // ===== ÉTAT : IMAGE CAPTURÉE =====
  if (imageUri) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📸 Aperçu</Text>
          <Text style={styles.subtitle}>
            Vérifie que le problème est bien visible
          </Text>
        </View>

        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
        </View>

        <View style={styles.previewActions}>
          <GradientButton
            title="Analyser avec l'AI"
            icon="🧠"
            onPress={handleAnalyze}
            size="large"
          />
          <GradientButton
            title="Reprendre la photo"
            icon="🔄"
            onPress={handleReset}
            variant="outline"
            size="medium"
          />
        </View>
      </View>
    );
  }

  // ===== ÉTAT : SÉLECTION DE SOURCE =====
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 Capture</Text>
        <Text style={styles.subtitle}>
          Photographie ton problème de maths
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.85}
          onPress={handleTakePhoto}>
          <View style={[styles.optionIcon, { backgroundColor: Colors.primary + '20' }]}>
            <Text style={styles.optionEmoji}>📷</Text>
          </View>
          <Text style={styles.optionTitle}>Prendre une photo</Text>
          <Text style={styles.optionSubtitle}>
            Utilise ta caméra pour capturer l'exercice
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.85}
          onPress={handlePickImage}>
          <View style={[styles.optionIcon, { backgroundColor: Colors.accent + '20' }]}>
            <Text style={styles.optionEmoji}>🖼️</Text>
          </View>
          <Text style={styles.optionTitle}>Choisir une image</Text>
          <Text style={styles.optionSubtitle}>
            Sélectionne depuis ta galerie photo
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Conseils pour de meilleurs résultats :</Text>
        <Text style={styles.tip}>• Assure-toi que le texte est bien éclairé</Text>
        <Text style={styles.tip}>• Évite les ombres sur le papier</Text>
        <Text style={styles.tip}>• Cadre uniquement le problème à résoudre</Text>
        <Text style={styles.tip}>• L'écriture doit être lisible</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  optionsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  tipsContainer: {
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.sm,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  tip: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
  previewContainer: {
    flex: 1,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewActions: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
});

export default CameraScreen;