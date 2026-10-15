// ============================================
// 📁 EMPLACEMENT : src/components/MathCard.tsx
// 🃏 Rôle : Carte affichant un problème résolu dans l'historique
// ============================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '../theme';
import { MathProblem } from '../types';
import { formatDate, truncateText, getCategoryStyle, getDifficultyColor } from '../utils/helpers';

interface MathCardProps {
  problem: MathProblem;
  onPress: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}

const MathCard: React.FC<MathCardProps> = ({ problem, onPress, onFavorite, onDelete }) => {
  const categoryStyle = getCategoryStyle(problem.category);
  const difficultyColor = getDifficultyColor(problem.difficulty);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}>
      {/* En-tête avec catégorie et date */}
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryStyle.color + '20' }]}>
          <Text style={styles.categoryEmoji}>{categoryStyle.emoji}</Text>
          <Text style={[styles.categoryText, { color: categoryStyle.color }]}>
            {problem.category}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(problem.createdAt)}</Text>
      </View>

      {/* Aperçu de l'image (si disponible) */}
      {problem.imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: problem.imageUri }} style={styles.image} resizeMode="cover" />
        </View>
      ) : null}

      {/* Question */}
      <Text style={styles.question} numberOfLines={2}>
        {truncateText(problem.question, 100)}
      </Text>

      {/* Aperçu de la solution */}
      <Text style={styles.solutionPreview} numberOfLines={1}>
        💡 {truncateText(problem.solution, 80)}
      </Text>

      {/* Footer avec difficulté, étapes et actions */}
      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <View style={[styles.difficultyDot, { backgroundColor: difficultyColor }]} />
          <Text style={styles.metaText}>{problem.steps.length} étapes</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onFavorite} style={styles.actionButton}>
            <Text style={styles.actionIcon}>
              {problem.isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  imageContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  question: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: Spacing.xs,
  },
  solutionPreview: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 18,
  },
});

export default MathCard;