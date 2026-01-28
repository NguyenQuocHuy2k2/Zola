import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Category } from '@/services/product.service';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number;
  onSelectCategory: (id: number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  if (categories.length === 0) return null;

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => {
          const isActive = item.id === selectedCategoryId;
          return (
            <TouchableOpacity
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelectCategory(item.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filterList: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipActive: {
    backgroundColor: '#1E1E1E',
    borderColor: '#1E1E1E',
  },
  chipText: { fontSize: 13, color: '#555555', fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF' },
});
