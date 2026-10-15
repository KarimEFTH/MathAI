// ============================================
// 📁 EMPLACEMENT : src/screens/HomeScreen.tsx
// 🏠 Rôle : Écran d'accueil principal
// ============================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '../theme';
import { MathProblem } from '../types';
import { getAllProblems } from '../services/StorageService';
import { solveMathFromText } from '../services/AIService';
import GradientButton from '../components/GradientButton';
import MathCard from '../components/MathCard';
import EmptyState from '../components/EmptyState';
import { generateId } from '../utils/helpers';
import { saveProblem, deleteProblem, toggleFavorite } from '../services/StorageService';

const HomeScreen = ({ navigation }: any) => {
  const [textInput, setTextInput] = useState('');
  const [recentProblems, setRecentProblems] = useState<MathProblem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    const problems = await getAllProblems();
    setRecentProblems(problems.slice(0, 5));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSolveText = async () => {
    if (!textInput.trim()) {
      Alert.alert('Oops', 'Tape un problème de maths d\'abord ! 😊');
      return;
    }

    setIsLoading(true);
    try {
      const result = await solveMathFromText(textInput.trim());

      if (!result.success) {
        Alert.alert('Erreur', result.error || 'Impossible de résoudre le problème.');
        return;
      }

      const problem: MathProblem = {
        id: generateId(),
        imageUri: '',
        question: result.question,
        solution: result.solution,
        steps: result.steps,
        category: result.category,
        difficulty: result.difficulty,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      await saveProblem(problem);
      setTextInput('');
      navigation.navigate('Solution', { problem });
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Supprimer', 'Supprimer ce problème ?', [
      { text: 'Non' },
      {
        text: 'Oui',
        style: 'destructive',
        onPress: async () => {
          await deleteProblem(id);
          loadData();
        },
      },
    ]);
  };

  const handleFavorite = async (id: string) => {
    await toggleFavorite(id);
    loadData();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }>
          <View style={styles.header}>
            <Text style={styles.greeting}>Salut ! 👋</Text>
            <Text style={styles.title}>Math AI</Text>
            <Text style={styles.subtitle}>
              Ton assistant maths intelligent
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>✍️ Tape ton problème</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Résous 2x + 5 = 15"
                placeholderTextColor={Colors.textMuted}
                value={textInput}
                onChangeText={setTextInput}
                multiline
                numberOfLines={3}
              />
              <GradientButton
                title="Résoudre"
                icon="🧠"
                onPress={handleSolveText}
                loading={isLoading}
                disabled={!textInput.trim()}
                size="medium"
              />
            </View>
          </View>

          <View style={styles.cameraSection}>
            <Text style={styles.orText}>— OU —</Text>
            <TouchableOpacity
              style={styles.cameraButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Camera')}>
              <Text style={styles.cameraEmoji}>📸</Text>
              <Text style={styles.cameraTitle}>Prendre une photo</Text>
              <Text style={styles.cameraSubtitle}>
                Photographie ton exercice de maths
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>📚 Récents</Text>
              {recentProblems.length > 0 && (
                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                  <Text style={styles.seeAll}>Voir tout →</Text>
                </TouchableOpacity>
              )}
            </View>

            {recentProblems.length === 0 ? (
              <EmptyState
                icon="🎯"
                title="Aucun problème résolu"
                subtitle="Tape un problème ou prends une photo pour commencer !"
              />
            ) : (
              recentProblems.map(problem => (
                <MathCard
                  key={problem.id}
                  problem={problem}
                  onPress={() => navigation.navigate('Solution', { problem })}
                  onFavorite={() => handleFavorite(problem.id)}
                  onDelete={() => handleDelete(problem.id)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl, paddingBottom: Spacing.lg },
  greeting: { color: Colors.textSecondary, fontSize: FontSize.md, marginBottom: Spacing.xs },
  title: { color: Colors.textPrimary, fontSize: FontSize.title, fontWeight: '800', letterSpacing: -1 },
  subtitle: { color: Colors.textMuted, fontSize: FontSize.md, marginTop: Spacing.xs },
  inputSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.sm },
  inputContainer: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm },
  textInput: { color: Colors.textPrimary, fontSize: FontSize.md, minHeight: 60, textAlignVertical: 'top' },
  cameraSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg, alignItems: 'center' },
  orText: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.md, letterSpacing: 2 },
  cameraButton: { width: '100%', backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.primary + '40', borderStyle: 'dashed', ...Shadows.small },
  cameraEmoji: { fontSize: 40, marginBottom: Spacing.sm },
  cameraTitle: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.xs },
  cameraSubtitle: { color: Colors.textMuted, fontSize: FontSize.sm },
  recentSection: { paddingHorizontal: Spacing.lg },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAll: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
});

export default HomeScreen;