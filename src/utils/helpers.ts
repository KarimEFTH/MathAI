// ============================================
// 📁 EMPLACEMENT : src/utils/helpers.ts
// 🔧 Rôle : Fonctions utilitaires réutilisables
// ============================================

/**
 * Générer un ID unique (remplace uuid)
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Formater une date ISO en texte lisible
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Tronquer un texte avec des points de suspension
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Catégorie en emoji + couleur
 */
export const getCategoryStyle = (category: string): { emoji: string; color: string } => {
  const styles: Record<string, { emoji: string; color: string }> = {
    algebra: { emoji: '🔢', color: '#6C5CE7' },
    geometry: { emoji: '📐', color: '#00B894' },
    calculus: { emoji: '📈', color: '#E17055' },
    statistics: { emoji: '📊', color: '#00CEC9' },
    trigonometry: { emoji: '📏', color: '#FDCB6E' },
    arithmetic: { emoji: '➕', color: '#74B9FF' },
    other: { emoji: '🧮', color: '#A29BFE' },
  };
  return styles[category] || styles.other;
};

/**
 * Difficulté en couleur
 */
export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    easy: '#00B894',
    medium: '#FDCB6E',
    hard: '#FF6B6B',
  };
  return colors[difficulty] || colors.medium;
};