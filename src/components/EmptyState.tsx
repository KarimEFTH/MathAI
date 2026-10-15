// ============================================
// 📁 EMPLACEMENT : src/components/EmptyState.tsx
// 📭 Rôle : Affichage quand il n'y a pas de données
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../theme';
import GradientButton from './GradientButton';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionTitle?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionTitle,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionTitle && onAction && (
        <View style={styles.buttonContainer}>
          <GradientButton title={actionTitle} onPress={onAction} size="medium" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
});

export default EmptyState;