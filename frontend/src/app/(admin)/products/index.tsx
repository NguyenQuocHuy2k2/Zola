import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  productService,
  Product,
  SearchFilters,
} from '@/services/product.service';
import ProductCard from '@/components/admin/products/product-card';
import ProductListHeader from '@/components/admin/products/product-list-header';

export default function AdminProducts() {
  const theme = useTheme();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filters: SearchFilters = {
        keyword: search,
        status: statusFilter,
        page: 0,
        size: 100,
      };
      const response = await productService.searchProducts(filters);
      setProducts(response.content || []);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [search, statusFilter]),
  );

  const handleToggleStatus = async (productId: string) => {
    try {
      await productService.toggleProductStatus(productId);
      // Refresh the product list
      await loadProducts();
    } catch (error) {
      console.error('Failed to toggle product status', error);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ProductListHeader
          searchQuery={search}
          onSearchChange={setSearch}
          productCount={products.length}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onToggleStatus={handleToggleStatus}
              />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#fff"
        onPress={() => router.push('/products/create')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAFA' },
  container: { flex: 1, padding: 16 },
  separator: { height: 8 },
  fab: { position: 'absolute', right: 16, bottom: 24 },
});