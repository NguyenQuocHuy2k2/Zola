import { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, IconButton, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Product } from '@/services/product.service';
import ConfirmModal from '@/components/ui/confirm-modal';

interface ProductCardProps {
    product: Product;
    onToggleStatus: (productId: string) => Promise<void>;
}

export default function ProductCard({
    product,
    onToggleStatus,
}: ProductCardProps) {
    const router = useRouter();
    const [toggleModal, setToggleModal] = useState<{
        visible: boolean;
        productId: string | null;
        action: 'deactivate' | 'activate';
    }>({ visible: false, productId: null, action: 'deactivate' });

    const primaryImage =
        product.images?.find((img) => img.isPrimary)?.imageUrl ||
        product.images?.[0]?.imageUrl;
    const totalStock =
        product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;

    const handleTogglePress = () => {
        const action = product.status === 'ACTIVE' ? 'deactivate' : 'activate';
        setToggleModal({
            visible: true,
            productId: product.id.toString(),
            action,
        });
    };

    const handleToggleConfirm = async () => {
        if (!toggleModal.productId) return;
        try {
            await onToggleStatus(toggleModal.productId);
            setToggleModal({
                visible: false,
                productId: null,
                action: 'deactivate',
            });
        } catch (error) {
            setToggleModal({
                visible: false,
                productId: null,
                action: 'deactivate',
            });
        }
    };

    const handleToggleModalClose = () => {
        setToggleModal({
            visible: false,
            productId: null,
            action: 'deactivate',
        });
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
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.info}>
                        <View style={styles.infoTop}>
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
                        </View>
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
                    <View style={styles.actions}>
                        <IconButton
                            icon={
                                product.status === 'ACTIVE'
                                    ? 'archive-outline'
                                    : 'eye-outline'
                            }
                            size={20}
                            style={styles.toggleIcon}
                            onPress={handleTogglePress}
                        />
                    </View>
                </View>
            </TouchableOpacity>
            <ConfirmModal
                visible={toggleModal.visible}
                title={
                    toggleModal.action === 'deactivate'
                        ? 'Ngừng bán sản phẩm'
                        : 'Kích hoạt sản phẩm'
                }
                message={
                    toggleModal.action === 'deactivate'
                        ? 'Bạn có chắc chắn muốn ngừng bán sản phẩm này? Sản phẩm sẽ không còn hiển thị cho khách hàng.'
                        : 'Bạn có chắc chắn muốn kích hoạt sản phẩm này? Sản phẩm sẽ hiển thị lại cho khách hàng.'
                }
                onConfirm={handleToggleConfirm}
                onCancel={handleToggleModalClose}
                confirmLabel={
                    toggleModal.action === 'deactivate'
                        ? 'Ngừng bán'
                        : 'Kích hoạt'
                }
                cancelLabel="Hủy"
                icon={
                    toggleModal.action === 'deactivate'
                        ? 'archive-outline'
                        : 'eye-outline'
                }
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
        alignItems: 'center',
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
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    infoTop: {
        marginBottom: 8,
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
    actions: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    toggleIcon: {
        margin: 0,
    },
});
