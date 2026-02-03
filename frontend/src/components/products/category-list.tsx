import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Category } from '@/services/product.service';

interface CategoryListProps {
  categories: Category[];
}

// Giao diện list danh mục (Slide ngang)
export const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const router = useRouter();

  if (!categories || categories.length === 0) return null;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Danh mục</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((cat) => (
          <TouchableOpacity 
            key={cat.id} 
            style={styles.categoryItem} 
            onPress={() => router.push({ pathname: '/product/category/[id]', params: { id: cat.id, name: cat.name } })}
          >
            <View style={styles.categoryIconWrap}>
              <Image source={{ uri: cat?.imageUrl }} style={styles.categoryImage} resizeMode="cover" />
            </View>
            <Text variant="bodySmall" style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ width: 16 }} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  categoriesContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  categoryIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  categoryName: {
    textAlign: 'center',
  },
});
