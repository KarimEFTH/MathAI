// ============================================
// 📁 EMPLACEMENT : src/components/GradientButton.tsx
// 🎨 Rôle : Bouton stylisé avec dégradé
// ============================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { Colors, FontSize, BorderRadius, Spacing, Shadows } from '../theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;       // Emoji icon
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  icon,
  loading = false,
  disabled = false,
  size = 'medium',
  variant = 'primary',
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.buttonText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        isDisabled && styles.disabledButton,
      ]}>
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[getTextStyle(), size === 'small' && styles.smallText]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceLight,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  smallButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  mediumButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  largeButton: {
    paddingVertical: Spacing.lg - 4,
    paddingHorizontal: Spacing.xl,
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  icon: {
    fontSize: FontSize.lg,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outlineText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: FontSize.sm,
  },
});

export default GradientButton;