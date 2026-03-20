import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { productService, Product, ProductVariant } from '@/services/product.service';
import { attributeService, Size, Color } from '@/services/attribute.service';
import { VariantModal } from '@/components/admin/products/variant-modal';
import { VariantTable } from '@/components/admin/products/variant-table';
import ConfirmModal from '@/components/ui/confirm-modal';
import StatusModal, { StatusType } from '@/components/ui/status-modal';

export default function StockManagement() {
    const theme = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
    const [availableColors, setAvailableColors] = useState<Color[]>([]);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Modal state
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
    const [initialModalData, setInitialModalData] = useState({ sizeId: null as number | null, colorId: null as number | null, quantity: '0' });

    // Custom Modal State
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        title: '',
        message: '',
        onConfirm: () => {},
    });
    const [statusModal, setStatusModal] = useState({
        visible: false,
        type: 'success' as StatusType,
        title: '',
        message: '',
    });

    const showStatus = (type: StatusType, title: string, message: string) => {
        setStatusModal({ visible: true, type, title, message });
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [p, szs, clrs] = await Promise.all([
                productService.getProductById(id),
                attributeService.getSizes(),
                attributeService.getColors()
            ]);
            setProduct(p);
            setAvailableSizes(szs);
            setAvailableColors(clrs);
            setVariants(p.variants || []);
        } catch (error) {
            showStatus('error', 'Lỗi', 'Không thể tải dữ liệu kho hàng');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        loadData();
    }, [id]));

    const openAddModal = () => {
        if (availableSizes.length === 0 || availableColors.length === 0) {
            showStatus('warning', 'Thiếu dữ liệu', 'Vui lòng cấu hình Kích cỡ và Màu sắc hệ thống trước.');
            return;
        }
        setEditingVariantId(null);
        setInitialModalData({
            sizeId: availableSizes[0].id,
            colorId: availableColors[0].id,
            quantity: '0'
        });
        setIsAddModalVisible(true);
    };

    const openEditModal = (variant: ProductVariant) => {
        setEditingVariantId(variant.id);
        setInitialModalData({
            sizeId: variant.size?.id || null,
            colorId: variant.color?.id || null,
            quantity: variant.stockQuantity.toString()
        });
        setIsAddModalVisible(true);
    };

    const handleSaveVariant = async (data: { sizeId: number; colorId: number; quantity: number }) => {
        setSaving(true);
        try {
            if (editingVariantId) {
                await productService.updateVariantStock(editingVariantId, data.quantity);
            } else {
                const exists = variants.find(v => v.size?.id === data.sizeId && v.color?.id === data.colorId);
                if (exists) {
                    showStatus('error', 'Lỗi', 'Biến thể này đã tồn tại.');
                    setSaving(false);
                    return;
                }
                await productService.createVariant(id, {
                    sizeId: data.sizeId,
                    colorId: data.colorId,
                    stockQuantity: data.quantity
                });
            }
            await loadData();
            setIsAddModalVisible(false);
        } catch (error) {
            showStatus('error', 'Lỗi', 'Không thể lưu biến thể');
        } finally {
            setSaving(false);
        }
    };

    const removeVariant = (variantId: number) => {
        setConfirmModal({
            visible: true,
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa biến thể này?',
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, visible: false }));
                try {
                    await productService.deleteVariant(variantId);
                    await loadData();
                } catch (error) {
                    showStatus('error', 'Lỗi', 'Không thể xóa biến thể');
                }
            }
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <VariantModal
                visible={isAddModalVisible}
                onDismiss={() => setIsAddModalVisible(false)}
                editingVariantId={editingVariantId}
                availableSizes={availableSizes}
                availableColors={availableColors}
                saving={saving}
                onSave={handleSaveVariant}
                initialData={initialModalData}
            />

            <ConfirmModal
                visible={confirmModal.visible}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
                confirmColor="#F44336"
                icon="delete-outline"
            />

            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => setStatusModal(prev => ({ ...prev, visible: false }))}
            />

            <View style={styles.header}>
                <IconButton 
                    icon="arrow-left" 
                    size={28} 
                    onPress={() => router.navigate(`/(admin)/products/${id}`)}
                    style={styles.backButton}
                />
                <View style={styles.headerTitleContainer}>
                    <Text variant="headlineSmall" style={styles.headerTitle}>Nhập kho & Biến thể</Text>
                    <Text variant="bodySmall" style={styles.subTitle} numberOfLines={1}>{product?.name}</Text>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Danh sách biến thể ({variants.length})</Text>
                    <Button 
                        icon="plus" 
                        mode="contained" 
                        onPress={openAddModal} 
                        style={styles.addButton}
                        buttonColor="#528F72"
                    >
                        Thêm mới
                    </Button>
                </View>

                <VariantTable 
                    variants={variants}
                    onEdit={openEditModal}
                    onDelete={removeVariant}
                />

                {variants.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <IconButton icon="layers-plus" size={64} iconColor="#E0E0E0" />
                        <Text variant="bodyLarge" style={styles.emptyText}>Chưa có biến thể nào</Text>
                        <Text variant="bodySmall" style={{color: '#999', marginTop: 4}}>Nhấn nút Thêm mới ở trên để bắt đầu</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingHorizontal: 16, 
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        position: 'relative',
        minHeight: 64
    },
    headerTitleContainer: { 
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: { fontWeight: 'bold', color: '#1E1E1E', fontSize: 18, textAlign: 'center' },
    subTitle: { color: '#8A8A8A', marginTop: 2, fontSize: 13, textAlign: 'center' },
    backButton: {
        position: 'absolute',
        left: 4,
        zIndex: 1,
    },
    scrollContent: { padding: 16, paddingBottom: 40 },
    sectionHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 10,
    },
    sectionTitle: { fontWeight: 'bold', color: '#1E1E1E' },
    addButton: { borderRadius: 25 },
    emptyContainer: { padding: 80, alignItems: 'center' },
    emptyText: { color: '#528F72', marginTop: 12, fontWeight: 'bold' },
});
