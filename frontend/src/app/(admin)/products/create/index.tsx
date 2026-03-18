import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { productService, CreateProductDto } from '@/services/product.service';
import { ProductForm } from '@/components/admin/products/product-form';

export default function NewProduct() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const handleSave = async (productData: CreateProductDto, images: any[]) => {
        setSaving(true);
        try {
            const response = await productService.createProduct(productData, images);
            Alert.alert('Thành công', 'Đã thêm sản phẩm mới. Bạn có muốn nhập kho cho sản phẩm này ngay không?', [
                { text: 'Để sau', onPress: () => router.back() },
                { text: 'Nhập kho ngay', onPress: () => router.replace(`/products/${response.id}/variant`) }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi thêm sản phẩm');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ProductForm 
            title="Thêm sản phẩm mới"
            onSave={handleSave}
            loading={saving}
            onCancel={() => router.back()}
        />
    );
}
