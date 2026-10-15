// ============================================
// 📁 EMPLACEMENT : src/screens/HistoryScreen.tsx
// 📚 Rôle : Historique de tous les problèmes résolus
//    Avec filtrage et recherche
// ============================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, FontSize, Spacing, BorderRadius } from '../theme';
import { MathProblem, MathCategory } from '../types';
import { getAllProblems, deleteProblem, toggleFavorite, clearAllProblems } from '../services/StorageService';
import MathCard from '../components/MathCard';
import EmptyState from '../components/EmptyState';

type FilterType = 'all' | 'favorites' | MathCategory;

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '📋 Tout' },
  { key: 'favorites', label: '⭐ Favoris' },
  { key: 'algebra', label: '🔢 Algèbre' },
  { key: 'geometry', label: '📐 Géométrie' },
  { key: 'calculus', label: '📈 Calcul' },
  { key: 'arithmetic', label: '➕ Arithm.' },
];

const HistoryScreen = ({ navigation }: any) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<MathProblem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useFocusEffect(
    useCallback(() => {
      loadProblems();
    }, []),
  );

  const loadProblems = async () => {
    const all = await getAllProblems();
    setProblems(all);
    applyFilters(all, activeFilter, searchQuery);
  };

  const applyFilters = (data: MathProblem[], filter: FilterType, query: string) => {
    let result = [...data];

    // Filtre par catégorie
    if (filter === 'favorites') {
      result = result.filter(p => p.isFavorite);
    } else if (filter !== 'all') {
      result = result.filter(p => p.category === filter);
    }

    // Filtre par recherche
    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        p =>
          p.question.toLowerCase().includes(lower) ||
          p.solution.toLowerCase().includes(lower),
      );
    }

    setFilteredProblems(result);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    applyFilters(problems, filter, searchQuery);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(problems, activeFilter, query);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Supprimer', 'Supprimer ce problème ?', [
      { text: 'Non' },
      {
        text: 'Oui',
        style: 'destructive',
        onPress: async () => {
          await deleteProblem(id);
          loadProblems();
        },
      },
    ]);
  };

  const handleFavorite = async (id: string) => {
    await toggleFavorite(id);
    loadProblems();
  };

  const handleClearAll = () => {
    Alert.alert(
      'Tout supprimer',
      'Supprimer tout l\'historique ? Cette action est irréversible.',
      [
        { text: 'Annuler' },
        {
          text: 'Supprimer tout',
          style: 'destructive',
          onPress: async () => {
            await clearAllProblems();
            loadProblems();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>📚 Historique</Text>
          {problems.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAll}>Tout effacer</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>
          {problems.length} problème{problems.length !== 1 ? 's' : ''} résolu{problems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* ===== RECHERCHE ===== */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Rechercher un problème..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* ===== FILTRES ===== */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={item => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilter === item.key && styles.filterChipActive,
            ]}
            onPress={() => handleFilterChange(item.key)}>
            <Text
              style={[
                styles.filterText,
                activeFilter === item.key && styles.filterTextActive,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* ===== LISTE DES PROBLÈMES ===== */}
      {filteredProblems.length === 0 ? (
        <EmptyState
          icon={activeFilter === 'favorites' ? '⭐' : '📭'}
          title={
            searchQuery
              ? 'Aucun résultat'
              : activeFilter === 'favorites'
              ? 'Pas de favoris'
              : 'Historique vide'
          }
          subtitle={
            searchQuery
              ? 'Essaie avec d\'autres mots-clés'
              : 'Résous ton premier problème de maths !'
          }
          actionTitle={!searchQuery ? 'Commencer' : undefined}
          onAction={!searchQuery ? () => navigation.navigate('HomeTab') : undefined}
        />
      ) : (
        <FlatList
          data={filteredProblems}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MathCard
              problem={item}
              onPress={() => navigation.navigate('Solution', { problem: item })}
              onFavorite={() => handleFavorite(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
  },
  clearAll: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  // Search
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  // Filters
  filtersContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.white,
  },
  // List
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
});

export default HistoryScreen;