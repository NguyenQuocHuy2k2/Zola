import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, useTheme, FAB, Searchbar, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { productService, Product } from '@/services/product.service';
import { attributeService, Category } from '@/services/attribute.service';

export default function AdminProducts() {
 const theme = useTheme();
 const router = useRouter();
 const [products, setProducts] = useState<Product[]>([]);
 const [categories, setCategories] = useState<Category[]>([]);
 const [search, setSearch] = useState('');
 const [loading, setLoading] = useState(true);

 const loadData = async () => {
  setLoading(true);
  try {
   const [response, cats] = await Promise.all([
    productService.getProducts(0, 100),
    attributeService.getCategories()
   ]);
   setProducts(response.content || response); // Handle both PagedResponse and raw array
   setCategories(cats);
  } catch (error) {
   console.error('Failed to load products', error);
  } finally {
   setLoading(false);
  }
 };

 useFocusEffect(useCallback(() => {
  loadData();
 }, []));

 const filtered = products.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase())
 );

 const renderItem = ({ item }: { item: Product }) => {
  const primaryImage = item.images?.find(img => img.isPrimary)?.imageUrl || item.images?.[0]?.imageUrl;
  const totalStock = item.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;

  return (
   <TouchableOpacity style={styles.card} onPress={() => router.push(`/products/${item.id}`)}>
    <View style={styles.imageContainer}>
     <Image source={{ uri: primaryImage || 'https://via.placeholder.com/150' }} style={styles.img} />
     {item.variants && item.variants.length > 0 && (
      <Chip compact style={styles.variantBadge} textStyle={{ fontSize: 10 }}>
       {item.variants.length} biến thể
      </Chip>
     )}
    </View>
    <View style={styles.info}>
     <Text variant="bodyLarge" numberOfLines={2} style={{ fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
     <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
      {item.basePrice.toLocaleString('vi-VN')}đ
     </Text>
     <View style={styles.meta}>
      <Chip compact icon="tag-outline" style={styles.chip} textStyle={{ fontSize: 11 }}>
       {item.category?.name || '—'}
      </Chip>
      <View style={styles.stockBadge}>
       <Text variant="bodySmall" style={styles.stockText}>Tồn: {totalStock}</Text>
      </View>
     </View>
    </View>
    <IconButton
     icon="chevron-right"
     size={20}
     style={styles.arrowIcon}
    />
   </TouchableOpacity>
  );
 };

 return (
  <SafeAreaView style={styles.safe}>
   <View style={styles.container}>
    <Text variant="headlineSmall" style={styles.title}>Sản phẩm</Text>
    <Searchbar
     placeholder="Tìm kiếm sản phẩm..."
     value={search}
     onChangeText={setSearch}
     style={styles.search}
    />
    <Text variant="bodySmall" style={styles.count}>{filtered.length} sản phẩm</Text>
    {loading ? (
     <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
    ) : (
     <FlatList
      data={filtered}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
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
 title: { fontWeight: 'bold', marginBottom: 12 },
 search: { marginBottom: 8, backgroundColor: '#fff' },
 count: { color: '#888', marginBottom: 8 },
 card: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 12,
  alignItems: 'center',
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
 },
 imageContainer: {
  position: 'relative',
  width: 80,
  height: 80,
 },
 img: {
  width: 80,
  height: 80,
  borderRadius: 10,
  backgroundColor: '#eee',
 },
 variantBadge: {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
 },
 info: {
  flex: 1,
  marginLeft: 12,
 },
 meta: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 6,
  marginTop: 6,
 },
 chip: {
  backgroundColor: '#E8F5E9',
  alignSelf: 'flex-start',
 },
 stockBadge: {
  backgroundColor: '#FFF3E0',
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 4,
 },
 stockText: {
  color: '#F57C00',
  fontSize: 11,
  fontWeight: '500',
 },
 arrowIcon: {
  margin: 0,
  marginLeft: 4,
 },
 separator: { height: 8 },
 fab: { position: 'absolute', right: 16, bottom: 24 },
});
