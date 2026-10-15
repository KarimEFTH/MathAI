// ============================================
// 📁 EMPLACEMENT : src/services/StorageService.ts
// 💾 Rôle : Gérer le stockage local (remplace Firebase)
//    Utilise AsyncStorage (équivalent de Hive/SharedPreferences en Flutter)
// ============================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MathProblem, AppSettings } from '../types';

// Clés de stockage
const KEYS = {
  PROBLEMS: '@math_ai_problems',
  SETTINGS: '@math_ai_settings',
};

// ========================
// GESTION DES PROBLÈMES
// ========================

/**
 * Sauvegarder un nouveau problème résolu
 */
export const saveProblem = async (problem: MathProblem): Promise<void> => {
  try {
    const existing = await getAllProblems();
    const updated = [problem, ...existing]; // Nouveau en premier
    await AsyncStorage.setItem(KEYS.PROBLEMS, JSON.stringify(updated));
  } catch (error) {
    console.error('Erreur sauvegarde problème:', error);
    throw error;
  }
};

/**
 * Récupérer tous les problèmes sauvegardés
 */
export const getAllProblems = async (): Promise<MathProblem[]> => {
  try {
    const json = await AsyncStorage.getItem(KEYS.PROBLEMS);
    if (!json) return [];
    return JSON.parse(json) as MathProblem[];
  } catch (error) {
    console.error('Erreur lecture problèmes:', error);
    return [];
  }
};

/**
 * Récupérer un problème par son ID
 */
export const getProblemById = async (id: string): Promise<MathProblem | null> => {
  try {
    const problems = await getAllProblems();
    return problems.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Erreur lecture problème:', error);
    return null;
  }
};

/**
 * Supprimer un problème
 */
export const deleteProblem = async (id: string): Promise<void> => {
  try {
    const problems = await getAllProblems();
    const filtered = problems.filter(p => p.id !== id);
    await AsyncStorage.setItem(KEYS.PROBLEMS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erreur suppression problème:', error);
    throw error;
  }
};

/**
 * Basculer le favori d'un problème
 */
export const toggleFavorite = async (id: string): Promise<void> => {
  try {
    const problems = await getAllProblems();
    const updated = problems.map(p =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p,
    );
    await AsyncStorage.setItem(KEYS.PROBLEMS, JSON.stringify(updated));
  } catch (error) {
    console.error('Erreur toggle favori:', error);
    throw error;
  }
};

/**
 * Supprimer tout l'historique
 */
export const clearAllProblems = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.PROBLEMS);
  } catch (error) {
    console.error('Erreur suppression historique:', error);
    throw error;
  }
};

// ========================
// GESTION DES PARAMÈTRES
// ========================

const DEFAULT_SETTINGS: AppSettings = {
  language: 'fr',
  theme: 'dark',
  apiKey: '', // L'utilisateur doit entrer sa clé API
  showSteps: true,
  saveHistory: true,
};

/**
 * Récupérer les paramètres
 */
export const getSettings = async (): Promise<AppSettings> => {
  try {
    const json = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (!json) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
  } catch (error) {
    console.error('Erreur lecture paramètres:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Sauvegarder les paramètres
 */
export const saveSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Erreur sauvegarde paramètres:', error);
    throw error;
  }
};

/**
 * Récupérer la clé API
 */
export const getApiKey = async (): Promise<string> => {
  const settings = await getSettings();
  return settings.apiKey;
};