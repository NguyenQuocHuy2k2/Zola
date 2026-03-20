import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { productService, CreateProductDto } from '@/services/product.service';
import { ProductForm } from '@/components/admin/products/product-form';
import ConfirmModal from '@/components/ui/confirm-modal';
import StatusModal, { StatusType } from '@/components/ui/status-modal';

export default function NewProduct() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [newProductId, setNewProductId] = useState<string | null>(null);
    const [statusModal, setStatusModal] = useState({
        visible: false,
        type: 'error' as StatusType,
        title: '',
        message: '',
    });

    const handleSave = async (productData: CreateProductDto, images: any[]) => {
        setSaving(true);
        try {
            const response = await productService.createProduct(productData, images);
            setNewProductId(response.id.toString());
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Lỗi',
                message: 'Đã có lỗi xảy ra khi thêm sản phẩm'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ProductForm 
                title="Thêm sản phẩm mới"
                onSave={handleSave}
                loading={saving}
                onCancel={() => router.navigate('/(admin)/products')}
            />
            
            <ConfirmModal
                visible={showSuccessModal}
                title="Thành công"
                message="Đã thêm sản phẩm mới. Bạn có muốn nhập kho cho sản phẩm này ngay không?"
                confirmLabel="NHẬP KHO NGAY"
                cancelLabel="ĐỂ SAU"
                icon="check-circle-outline"
                onConfirm={() => {
                    setShowSuccessModal(false);
                    if (newProductId) {
                        router.replace(`/(admin)/products/${newProductId}/variant`);
                    }
                }}
                onCancel={() => {
                    setShowSuccessModal(false);
                    router.navigate('/(admin)/products');
                }}
            />

            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => setStatusModal(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
}
