import { useState, useEffect, useCallback } from 'react';
import { View, Alert, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, Card, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { productService, Product, CreateProductDto } from '@/services/product.service';
import { ProductForm } from '@/components/admin/products/product-form';

export default function EditProduct() {
 const theme = useTheme();
 const router = useRouter();
 const { id } = useLocalSearchParams<{ id: string }>();

 const [loading, setLoading] = useState(false);
 const [saving, setSaving] = useState(false);
 const [product, setProduct] = useState<Product | null>(null);

 const loadProduct = async () => {
  if (!id) return;
  setLoading(true);
  try {
   const data = await productService.getProductById(id);
   setProduct(data);
  } catch (error) {
   Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
  } finally {
   setLoading(false);
  }
 };

 useFocusEffect(useCallback(() => {
  loadProduct();
 }, [id]));

 const handleSave = async (productData: CreateProductDto, images: any[]) => {
  if (!id) return;
  setSaving(true);
  try {
   await productService.updateProduct(id, productData);
   if (images.length > 0) {
    await productService.uploadProductImages(id, images);
   }
   Alert.alert('Thành công', 'Đã cập nhật sản phẩm', [{ text: 'OK', onPress: () => router.back() }]);
  } catch (error) {
   console.error(error);
   Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi lưu sản phẩm');
  } finally {
   setSaving(false);
  }
 };

 const handleDelete = async () => {
  Alert.alert(
   'Xóa sản phẩm',
   'Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.',
   [
    { text: 'Hủy', style: 'cancel' },
    {
     text: 'Xóa',
     style: 'destructive',
     onPress: async () => {
      try {
       await productService.deleteProduct(id);
       router.push('/products');
      } catch (error) {
       Alert.alert('Lỗi', 'Không thể xóa sản phẩm này');
      }
     }
    }
   ]
  );
 };

 if (loading || !product) {
  return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
   </View>
  );
 }

 const StockSummary = (
  <Card style={[{ marginBottom: 16, borderRadius: 12, elevation: 2, backgroundColor: theme.colors.primaryContainer }]}>
   <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <View>
     <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Kho hàng & Biến thể</Text>
     <Text variant="bodySmall">Sản phẩm hiện có {product.variants?.length || 0} biến thể</Text>
    </View>
    <Button mode="contained" icon="package-variant" onPress={() => router.push(`/products/${id}/variant`)}>
     Nhập kho
    </Button>
   </Card.Content>
  </Card>
 );

 return (
  <View style={{ flex: 1 }}>
   <ProductForm
    title="Chỉnh sửa sản phẩm"
    initialData={product}
    onSave={handleSave}
    loading={saving}
    onCancel={() => router.back()}
    extraContent={StockSummary}
   />

   <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, marginTop: 16 }}>
    <TouchableOpacity
     style={{
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
     }}
     onPress={() => router.push(`/products/${id}/edit`)}
    >
     <IconButton icon="pencil-outline" color="#fff" size={20} />
     <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '500' }}>Chỉnh sửa</Text>
    </TouchableOpacity>

    <TouchableOpacity
     style={{
      backgroundColor: '#EF4444',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
     }}
     onPress={handleDelete}
    >
     <IconButton icon="trash-can-outline" color="#fff" size={20} />
     <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '500' }}>Xóa</Text>
    </TouchableOpacity>
   </View>
  </View>
 );
}
