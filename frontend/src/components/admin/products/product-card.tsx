import { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, IconButton, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Product } from '@/services/product.service';
import ConfirmModal from '@/components/ui/confirm-modal';

interface ProductCardProps {
    product: Product;
    onDelete: (productId: string) => Promise<void>;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState<{
        visible: boolean;
        productId: string | null;
    }>({ visible: false, productId: null });

    const primaryImage =
        product.images?.find((img) => img.isPrimary)?.imageUrl ||
        product.images?.[0]?.imageUrl;
    const totalStock =
        product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;

    const handleDeletePress = () => {
        setDeleteModal({ visible: true, productId: product.id.toString() });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.productId) return;
        try {
            await onDelete(deleteModal.productId);
            setDeleteModal({ visible: false, productId: null });
        } catch (error) {
            setDeleteModal({ visible: false, productId: null });
        }
    };

    const handleModalClose = () => {
        setDeleteModal({ visible: false, productId: null });
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.productLayout}
                onPress={() => router.push(`/products/${product.id}`)}
            >
                <View style={styles.imageWrapper}>
                    <Image
                        source={{
                            uri:
                                primaryImage ||
                                'https://via.placeholder.com/150',
                        }}
                        style={styles.img}
                    />
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.info}>
                        <Text
                            variant="bodyLarge"
                            numberOfLines={2}
                            style={styles.productName}
                        >
                            {product.name}
                        </Text>
                        <Text variant="titleMedium" style={styles.price}>
                            {product.basePrice.toLocaleString('vi-VN')}đ
                        </Text>
                        <View style={styles.meta}>
                            <Chip
                                compact
                                icon="tag-outline"
                                style={styles.chip}
                                textStyle={styles.chipText}
                            >
                                {product.category?.name || '—'}
                            </Chip>
                            <View style={styles.stockBadge}>
                                <Text
                                    variant="bodySmall"
                                    style={styles.stockText}
                                >
                                    Tồn: {totalStock}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <IconButton
                        icon="trash-can-outline"
                        size={20}
                        style={styles.deleteIcon}
                        onPress={handleDeletePress}
                    />
                </View>
            </TouchableOpacity>
            <ConfirmModal
                visible={deleteModal.visible}
                title="Xóa sản phẩm"
                message="Bạn có chắc chắn muốn xóa sản phẩm này?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleModalClose}
                confirmLabel="Xóa"
                cancelLabel="Hủy"
                icon="trash-can-outline"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productLayout: {
        flexDirection: 'row',
        gap: 12,
    },
    imageWrapper: {
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
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    info: {
        flex: 1,
    },
    productName: {
        fontWeight: '600',
        marginBottom: 4,
    },
    price: {
        color: '#1976D2',
        fontWeight: '700',
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
    chipText: {
        fontSize: 11,
    },
    stockBadge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    stockText: {
        color: '#F57C00',
        fontSize: 11,
        fontWeight: '500',
    },
    deleteIcon: {
        margin: 0,
        alignSelf: 'center',
    },
});
