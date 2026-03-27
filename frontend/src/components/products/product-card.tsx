import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Product, getProductPrimaryImage } from '@/services/product.service';
import { formatPrice } from '@/utils/format';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width / 2 - 16;

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  width?: number;
  style?: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, width: customWidth, style }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const cardWidth = customWidth || COLUMN_WIDTH;

  return (
    <TouchableOpacity
      style={[styles.productCard, { width: cardWidth }, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: getProductPrimaryImage(product) }} 
        style={[styles.productImage, { width: cardWidth, height: cardWidth }]} 
        resizeMode="cover" 
      />

      <View style={styles.productContent}>
        <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formatPrice(product.basePrice)}</Text>
        </View>
        <Text numberOfLines={1} style={styles.statsText}>{product.brand}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  productImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  productContent: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    lineHeight: 20,
    height: 40, // 2 lines
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  statsText: {
    fontSize: 12,
    color: '#888',
  }
});
