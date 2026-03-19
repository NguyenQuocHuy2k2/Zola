import { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {
    productService,
    Product,
    CreateProductDto,
} from '@/services/product.service';
import { ProductForm } from '@/components/admin/products/product-form';
import { StockSummary } from '@/components/admin/products/stock-summary';
import StatusModal, { StatusType } from '@/components/ui/status-modal';

export default function EditProduct() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);
    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        type: StatusType;
        title: string;
        message: string;
        buttonLabel?: string;
    }>({ visible: false, type: 'info', title: '', message: '' });

    const loadProduct = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const data = await productService.getProductById(id);
            setProduct(data);
        } catch (error) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Không thể tải thông tin sản phẩm',
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadProduct();
        }, [id]),
    );

    const handleSave = async (productData: CreateProductDto, images: any[]) => {
        if (!id) return;
        setSaving(true);
        try {
            await productService.updateProduct(id, productData);
            if (images.length > 0) {
                await productService.uploadProductImages(id, images);
            }
            setStatusModal({
                visible: true,
                type: 'success',
                title: 'Thành công',
                message: 'Đã cập nhật sản phẩm',
                buttonLabel: 'OK',
            });
        } catch (error) {
            console.error(error);
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Đã có lỗi xảy ra khi lưu sản phẩm',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleStatusModalClose = () => {
        const currentType = statusModal.type;
        setStatusModal((prev) => ({ ...prev, visible: false }));
        if (currentType === 'success') {
            router.push('/(admin)/products');
        }
    };

    if (loading || !product) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ProductForm
                title="Chỉnh sửa sản phẩm"
                initialData={product}
                onSave={handleSave}
                loading={saving}
                onCancel={() => router.push('/(admin)/products')}
                extraContent={
                    <StockSummary
                        variantCount={product.variants?.length || 0}
                        productId={id}
                    />
                }
            />
            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                buttonLabel={statusModal.buttonLabel}
                onClose={handleStatusModalClose}
            />
        </View>
    );
}
