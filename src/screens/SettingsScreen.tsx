// ============================================
// 📁 EMPLACEMENT : src/screens/SettingsScreen.tsx
// ⚙️ Rôle : Paramètres (SANS section clé API)
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius } from '../theme';
import { AppSettings } from '../types';
import { getSettings, saveSettings, clearAllProblems } from '../services/StorageService';

const SettingsScreen = () => {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'fr',
    theme: 'dark',
    apiKey: '',
    showSteps: true,
    saveHistory: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const saved = await getSettings();
    setSettings(saved);
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await saveSettings({ [key]: value });
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Supprimer tous les problèmes résolus ? Cette action est irréversible.',
      [
        { text: 'Annuler' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            await clearAllProblems();
            Alert.alert('Fait !', 'L\'historique a été effacé.');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Paramètres</Text>
          <Text style={styles.subtitle}>Configure ton Math AI</Text>
        </View>

        {/* ===== PRÉFÉRENCES ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ Préférences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Afficher les étapes</Text>
              <Text style={styles.settingDescription}>
                Voir la résolution étape par étape
              </Text>
            </View>
            <Switch
              value={settings.showSteps}
              onValueChange={value => updateSetting('showSteps', value)}
              trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
              thumbColor={settings.showSteps ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sauvegarder l'historique</Text>
              <Text style={styles.settingDescription}>
                Garder les problèmes résolus en local
              </Text>
            </View>
            <Switch
              value={settings.saveHistory}
              onValueChange={value => updateSetting('saveHistory', value)}
              trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
              thumbColor={settings.saveHistory ? Colors.primary : Colors.textMuted}
            />
          </View>
        </View>

        {/* ===== LANGUE ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Langue</Text>
          <View style={styles.languageOptions}>
            {[
              { key: 'fr' as const, label: '🇫🇷 Français' },
              { key: 'en' as const, label: '🇬🇧 English' },
              { key: 'ar' as const, label: '🇲🇦 العربية' },
            ].map(lang => (
              <TouchableOpacity
                key={lang.key}
                style={[
                  styles.languageChip,
                  settings.language === lang.key && styles.languageChipActive,
                ]}
                onPress={() => updateSetting('language', lang.key)}>
                <Text
                  style={[
                    styles.languageText,
                    settings.language === lang.key && styles.languageTextActive,
                  ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===== DONNÉES ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Données</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearHistory}>
            <Text style={styles.dangerButtonText}>🗑️ Effacer tout l'historique</Text>
          </TouchableOpacity>
        </View>

        {/* ===== À PROPOS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.appName}>🧮 Math AI</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Ton assistant maths intelligent. Propulsé par OpenAI GPT-4.
            </Text>
            <Text style={styles.appCredit}>
              Développé avec ❤️ en React Native
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl, paddingBottom: Spacing.md },
  title: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { color: Colors.textMuted, fontSize: FontSize.md, marginTop: Spacing.xs },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.sm },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingInfo: { flex: 1, marginRight: Spacing.md },
  settingLabel: { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: '600' },
  settingDescription: { color: Colors.textMuted, fontSize: FontSize.xs, marginTop: 2 },
  languageOptions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  languageChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  languageText: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: '600' },
  languageTextActive: { color: Colors.white },
  dangerButton: {
    backgroundColor: Colors.error + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  dangerButtonText: { color: Colors.error, fontSize: FontSize.md, fontWeight: '600' },
  aboutCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  appName: { color: Colors.textPrimary, fontSize: FontSize.xl, fontWeight: '800', marginBottom: Spacing.xs },
  appVersion: { color: Colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.sm },
  appDescription: { color: Colors.textSecondary, fontSize: FontSize.sm, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xs },
  appCredit: { color: Colors.textMuted, fontSize: FontSize.xs },
});

export default SettingsScreen;