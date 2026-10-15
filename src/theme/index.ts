// ============================================
// 📁 EMPLACEMENT : src/theme/index.ts
// 🎨 Rôle : Design system de l'app (couleurs, fonts, tailles)
// ============================================

export const Colors = {
  // Couleurs principales
  primary: '#6C5CE7',      // Violet — couleur principale
  primaryLight: '#A29BFE',  // Violet clair
  primaryDark: '#5A4BD1',   // Violet foncé

  // Couleurs d'accent
  accent: '#00D2FF',        // Bleu cyan
  accentLight: '#74E4FF',
  success: '#00B894',       // Vert succès
  warning: '#FDCB6E',       // Jaune warning
  error: '#FF6B6B',         // Rouge erreur

  // Fond et surfaces
  background: '#0F0F1E',    // Fond principal (sombre)
  surface: '#1A1A2E',       // Cartes et surfaces
  surfaceLight: '#252547',  // Surface plus claire
  card: '#16213E',          // Fond des cartes

  // Texte
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0C8',
  textMuted: '#6C6C8A',

  // Autres
  border: '#2A2A4A',
  overlay: 'rgba(0, 0, 0, 0.6)',
  white: '#FFFFFF',
  black: '#000000',

  // Gradient (pour les boutons et headers)
  gradientStart: '#6C5CE7',
  gradientEnd: '#00D2FF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 34,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
};