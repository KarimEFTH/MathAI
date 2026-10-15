// ============================================
// 📁 EMPLACEMENT : src/screens/SolutionScreen.tsx
// 💡 Rôle : Afficher la solution AI étape par étape
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Platform,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius, Shadows } from '../theme';
import { MathProblem } from '../types';
import { getCategoryStyle, getDifficultyColor } from '../utils/helpers';
import { CategoryLabels, DifficultyLabels } from '../types';

const SolutionScreen = ({ route, navigation }: any) => {
  const { problem } = route.params as { problem: MathProblem };
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const categoryStyle = getCategoryStyle(problem.category);
  const difficultyColor = getDifficultyColor(problem.difficulty);

  const handleShare = async () => {
    try {
      let shareText = `🧮 Math AI — Solution\n\n`;
      shareText += `📝 Problème : ${problem.question}\n\n`;
      shareText += `✅ Réponse : ${problem.solution}\n\n`;
      shareText += `📋 Étapes :\n`;
      problem.steps.forEach(step => {
        shareText += `\n${step.stepNumber}. ${step.title}\n`;
        shareText += `   ${step.explanation}\n`;
        if (step.formula) shareText += `   📐 ${step.formula}\n`;
      });
      shareText += `\n— Résolu avec Math AI 🤖`;
      await Share.share({ message: shareText });
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareIcon}>📤</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>💡 Solution</Text>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: categoryStyle.color + '20' }]}>
              <Text style={[styles.badgeText, { color: categoryStyle.color }]}>
                {CategoryLabels[problem.category]}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: difficultyColor + '20' }]}>
              <Text style={[styles.badgeText, { color: difficultyColor }]}>
                {DifficultyLabels[problem.difficulty]}
              </Text>
            </View>
          </View>
        </View>

        {/* Image */}
        {problem.imageUri ? (
          <View style={styles.imageSection}>
            <Image source={{ uri: problem.imageUri }} style={styles.problemImage} resizeMode="contain" />
          </View>
        ) : null}

        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={styles.sectionLabel}>📝 Problème</Text>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{problem.question}</Text>
          </View>
        </View>

        {/* Réponse */}
        <View style={styles.answerSection}>
          <Text style={styles.sectionLabel}>✅ Réponse</Text>
          <View style={styles.answerCard}>
            <Text style={styles.answerText}>{problem.solution}</Text>
          </View>
        </View>

        {/* Étapes */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionLabel}>
            📋 Résolution ({problem.steps.length} étapes)
          </Text>

          {problem.steps.map((step, index) => {
            const isExpanded = expandedStep === index;
            const isLast = index === problem.steps.length - 1;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.85}
                onPress={() => setExpandedStep(isExpanded ? null : index)}
                style={[
                  styles.stepCard,
                  isExpanded && styles.stepCardExpanded,
                ]}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumberContainer}>
                    <Text style={styles.stepNumber}>{step.stepNumber}</Text>
                  </View>
                  <View style={styles.stepTitleContainer}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.stepDetails}>
                    <Text style={styles.stepExplanation}>{step.explanation}</Text>
                    {step.formula && (
                      <View style={styles.formulaContainer}>
                        <Text style={styles.formulaLabel}>📐 Formule :</Text>
                        <Text style={styles.formulaText}>{step.formula}</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nouveau problème */}
        <TouchableOpacity
          style={styles.newProblemButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('HomeTab')}>
          <Text style={styles.newProblemText}>🔄 Nouveau problème</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: Colors.textPrimary, fontSize: 20 },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center' },
  shareIcon: { fontSize: 18 },
  headerTitle: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: '800', marginBottom: Spacing.sm },
  badges: { flexDirection: 'row', gap: Spacing.sm },
  badge: { paddingHorizontal: Spacing.sm + 4, paddingVertical: 6, borderRadius: BorderRadius.full },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  imageSection: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, height: 180, borderRadius: BorderRadius.lg, overflow: 'hidden', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  problemImage: { flex: 1, width: '100%' },
  questionSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  sectionLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.sm, letterSpacing: 0.5 },
  questionCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  questionText: { color: Colors.textPrimary, fontSize: FontSize.md, lineHeight: 24 },
  answerSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  answerCard: { backgroundColor: Colors.primary + '15', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.primary + '40' },
  answerText: { color: Colors.accent, fontSize: FontSize.xl, fontWeight: '800', textAlign: 'center', lineHeight: 32 },
  stepsSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  stepCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border, ...Shadows.small },
  stepCardExpanded: { borderColor: Colors.primary + '60' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepNumberContainer: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  stepNumber: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '800' },
  stepTitleContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepTitle: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '600', flex: 1 },
  expandIcon: { color: Colors.textMuted, fontSize: FontSize.xs, marginLeft: Spacing.sm },
  stepDetails: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  stepExplanation: { color: Colors.textSecondary, fontSize: FontSize.md, lineHeight: 24 },
  formulaContainer: { marginTop: Spacing.sm, backgroundColor: Colors.surfaceLight, borderRadius: BorderRadius.md, padding: Spacing.sm + 4 },
  formulaLabel: { color: Colors.textMuted, fontSize: FontSize.xs, fontWeight: '600', marginBottom: 4 },
  formulaText: { color: Colors.accent, fontSize: FontSize.md, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  newProblemButton: { marginHorizontal: Spacing.lg, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  newProblemText: { color: Colors.primary, fontSize: FontSize.md, fontWeight: '700' },
});

export default SolutionScreen;