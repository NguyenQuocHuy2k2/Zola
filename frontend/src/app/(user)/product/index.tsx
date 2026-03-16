import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { productService, Category, Product } from '@/services/product.service';
import { ProductCard } from '@/components/products/product-card';
import { ProductSearchBar } from '@/components/products/product-search-bar';
import { CategoryList } from '@/components/products/category-list';
import { HotProductList } from '@/components/products/hot-product-list';
import { formatPrice } from '@/utils/format';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prods, cats, hot] = await Promise.all([
        productService.getProducts(0),
        productService.getCategories(),
        productService.getHotProducts()
      ]);
      setCategories(cats);
      setProducts(prods.content);
      setHotProducts(hot);
      setHasMore(!prods.last);
      setPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await productService.getProducts(nextPage);
      setProducts(prev => [...prev, ...res.content]);
      setPage(nextPage);
      setHasMore(!res.last);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderHeader = () => (
    <View>
      {/* User Greeting */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
          Chào, {user?.firstName || 'Bạn'}! 👋
        </Text>
        <Text variant="bodyMedium" style={{ opacity: 0.6 }}>
          Hôm nay bạn muốn mua gì nào?
        </Text>
      </View>

      <ProductSearchBar />

      <CategoryList categories={categories} />

      <HotProductList hotProducts={hotProducts} />

      {/* All Products Grid Header */}
      <View style={[styles.sectionHeader, { marginTop: 16 }]}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Gợi ý cho bạn</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }: { item: Product }) => (
          <ProductCard product={item} />
        )}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  listContent: {
    paddingBottom: 24,
  },
  row: {
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
