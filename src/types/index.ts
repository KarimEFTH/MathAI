// ============================================
// 📁 EMPLACEMENT : src/types/index.ts
// 📦 Rôle : Définir les modèles de données
//    (Équivalent des classes Model en Flutter/Dart)
// ============================================

// Un problème de maths résolu
export interface MathProblem {
  id: string;
  imageUri: string;           // Chemin de l'image capturée
  question: string;           // Le problème détecté par l'AI
  solution: string;           // La solution complète
  steps: SolutionStep[];      // Les étapes de résolution
  category: MathCategory;     // Catégorie (algèbre, géométrie, etc.)
  difficulty: Difficulty;     // Niveau de difficulté
  createdAt: string;          // Date ISO de création
  isFavorite: boolean;        // Marqué comme favori
}

// Une étape de la solution
export interface SolutionStep {
  stepNumber: number;
  title: string;              // Ex: "Étape 1 : Simplifier l'équation"
  explanation: string;        // Explication détaillée
  formula?: string;           // Formule mathématique (optionnel)
}

// Catégories de maths
export type MathCategory =
  | 'algebra'
  | 'geometry'
  | 'calculus'
  | 'statistics'
  | 'trigonometry'
  | 'arithmetic'
  | 'other';

// Niveaux de difficulté
export type Difficulty = 'easy' | 'medium' | 'hard';

// Paramètres de l'app
export interface AppSettings {
  language: 'fr' | 'en' | 'ar';
  theme: 'dark' | 'light';
  apiKey: string;
  showSteps: boolean;          // Afficher les étapes
  saveHistory: boolean;        // Sauvegarder l'historique
}

// Réponse de l'API OpenAI (parsée)
export interface AIResponse {
  success: boolean;
  question: string;
  solution: string;
  steps: SolutionStep[];
  category: MathCategory;
  difficulty: Difficulty;
  error?: string;
}

// Catégories avec labels pour l'UI
export const CategoryLabels: Record<MathCategory, string> = {
  algebra: '🔢 Algèbre',
  geometry: '📐 Géométrie',
  calculus: '📈 Calcul',
  statistics: '📊 Statistiques',
  trigonometry: '📏 Trigonométrie',
  arithmetic: '➕ Arithmétique',
  other: '🧮 Autre',
};

export const DifficultyLabels: Record<Difficulty, string> = {
  easy: '🟢 Facile',
  medium: '🟡 Moyen',
  hard: '🔴 Difficile',
};