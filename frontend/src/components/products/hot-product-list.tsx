import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Product, getProductPrimaryImage } from '@/services/product.service';
import { formatPrice } from '@/utils/format';

interface HotProductListProps {
  hotProducts: Product[];
}

// Chức năng hiển thị 10 sản phẩm bán chạy nhất ngang màn hình
export const HotProductList: React.FC<HotProductListProps> = ({ hotProducts }) => {
  const router = useRouter();
  const theme = useTheme();

  if (!hotProducts || hotProducts.length === 0) return null;

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hotProductsContainer}>
        {hotProducts.map((prod) => (
          <TouchableOpacity
            key={prod.id}
            style={styles.hotProductCard}
            onPress={() => router.push(`/product/${prod.id}`)}
          >
            <Image source={{ uri: getProductPrimaryImage(prod) }} style={styles.hotProductImage} />
            <Text numberOfLines={1} style={styles.hotProductName}>{prod.name}</Text>
            <Text style={{ color: theme.colors.error, fontWeight: 'bold' }}>{formatPrice(prod.basePrice)}</Text>
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
  hotProductsContainer: {
    paddingLeft: 16,
  },
  hotProductCard: {
    width: 140,
    marginRight: 16,
  },
  hotProductImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  hotProductName: {
    fontSize: 13,
    marginBottom: 4,
  },
});
