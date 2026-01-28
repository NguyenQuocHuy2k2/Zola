import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { favoriteService } from '@/services/favorite.service';
import { Product } from '@/services/product.service';
import { FavoriteList } from '@/components/favorite-list/favorite-list';

export default function FavoritesScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (products.length === 0) {
        loadInitialData();
      } else {
        // Silent refresh when focusing back
        refreshData();
      }
    }, [products.length])
  );

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const res = await favoriteService.getFavorites(0);
      setProducts(res.content);
      setHasMore(!res.last);
      setPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await favoriteService.getFavorites(0);
      setProducts(res.content);
      setHasMore(!res.last);
      setPage(0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await favoriteService.getFavorites(nextPage);
      setProducts(prev => [...prev, ...res.content]);
      setPage(nextPage);
      setHasMore(!res.last);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>Sản phẩm yêu thích</Text>
      </View>

      <FavoriteList
        products={products}
        loadingMore={loadingMore}
        onLoadMore={loadMoreProducts}
        onItemPress={(p) => router.push(`/profile/favorites/${p.id}`)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: -8,
    marginRight: 4,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
