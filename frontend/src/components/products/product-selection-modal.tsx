import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text, IconButton, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product, ProductVariant, getProductPrimaryImage } from '@/services/product.service';
import { formatPrice } from '@/utils/format';

interface ProductSelectionModalProps {
    visible: boolean;
    product: Product;
    onClose: () => void;
    onConfirm: (variant: ProductVariant, quantity: number) => void;
}

export default function ProductSelectionModal({
    visible,
    product,
    onClose,
    onConfirm
}: ProductSelectionModalProps) {
    const theme = useTheme();
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Unique colors
    const colors = useMemo(() => {
        const seen = new Set<number>();
        return product.variants
            .filter(v => v.color && !seen.has(v.color.id) && seen.add(v.color.id))
            .map(v => v.color!);
    }, [product]);

    // Sizes available for selected color
    const sizes = useMemo(() => {
        if (!selectedColorId) return [];
        const seen = new Set<number>();
        return product.variants
            .filter(v => v.size && v.color?.id === selectedColorId && !seen.has(v.size.id) && seen.add(v.size.id))
            .map(v => v.size!);
    }, [product, selectedColorId]);

    const selectedVariant = useMemo(() => {
        return product.variants.find(
            v => v.color?.id === selectedColorId && v.size?.id === selectedSizeId
        );
    }, [product, selectedColorId, selectedSizeId]);

    const handleConfirm = () => {
        if (selectedVariant) {
            onConfirm(selectedVariant, quantity);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <SafeAreaView edges={['bottom']}>
                        <View style={styles.header}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Chọn mẫu sản phẩm</Text>
                            <IconButton icon="close" onPress={onClose} size={20} />
                        </View>

                        <View style={styles.productBrief}>
                            <Image source={{ uri: getProductPrimaryImage(product) }} style={styles.briefImage} />
                            <View style={styles.briefInfo}>
                                <Text variant="titleMedium" numberOfLines={1}>{product.name}</Text>
                                <Text style={styles.price}>{formatPrice(product.basePrice)}</Text>
                                {selectedVariant && (
                                    <Text style={styles.stockText}>Kho: {selectedVariant.stockQuantity}</Text>
                                )}
                            </View>
                        </View>

                        <ScrollView style={styles.content}>
                            {/* Colors */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Màu sắc</Text>
                                <View style={styles.optionsRow}>
                                    {colors.map(color => {
                                        const isSelected = selectedColorId === color.id;
                                        const isWhite = color.hexCode.toUpperCase() === '#FFFFFF' || color.hexCode.toUpperCase() === '#FAFAFA' || color.hexCode.toLowerCase() === 'white';
                                        return (
                                            <TouchableOpacity
                                                key={color.id}
                                                onPress={() => {
                                                    setSelectedColorId(color.id);
                                                    setSelectedSizeId(null);
                                                }}
                                                style={[
                                                    styles.colorCircle,
                                                    { backgroundColor: color.hexCode },
                                                    isWhite && styles.whiteColorCircle,
                                                    isSelected && styles.colorCircleSelected
                                                ]}
                                            />
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Sizes */}
                            {selectedColorId && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Kích thước</Text>
                                    <View style={styles.optionsRow}>
                                        {sizes.map(size => (
                                            <TouchableOpacity
                                                key={size.id}
                                                onPress={() => setSelectedSizeId(size.id)}
                                                style={[
                                                    styles.optionChip,
                                                    selectedSizeId === size.id && styles.optionChipActive
                                                ]}
                                            >
                                                <Text style={[styles.optionText, selectedSizeId === size.id && styles.optionTextActive]}>
                                                    {size.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Quantity */}
                            <View style={styles.quantitySection}>
                                <Text style={styles.sectionTitle}>Số lượng</Text>
                                <View style={styles.quantityPill}>
                                    <TouchableOpacity
                                        style={[styles.quantityBtn, quantity <= 1 && { opacity: 0.3 }]}
                                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <IconButton icon="minus" size={20} />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{quantity}</Text>
                                    <TouchableOpacity
                                        style={[styles.quantityBtn, (selectedVariant ? quantity >= selectedVariant.stockQuantity : true) && { opacity: 0.3 }]}
                                        onPress={() => setQuantity(quantity + 1)}
                                        disabled={selectedVariant ? quantity >= selectedVariant.stockQuantity : true}
                                    >
                                        <IconButton icon="plus" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.footer}>
                            <Button
                                mode="contained"
                                onPress={handleConfirm}
                                disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                                style={[styles.confirmBtn, (!selectedVariant || selectedVariant.stockQuantity === 0) && { opacity: 0.4 }]}
                                buttonColor="#528F72"
                                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                            >
                                {!selectedVariant
                                    ? 'Vui lòng chọn phân loại'
                                    : (selectedVariant.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ')}
                            </Button>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    productBrief: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    briefImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
    },
    briefInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E1E1E',
        marginTop: 4,
    },
    stockText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    content: {
        maxHeight: 400,
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    optionChipActive: {
        backgroundColor: '#1E1E1E',
        borderColor: '#1E1E1E',
    },
    optionText: {
        fontSize: 13,
        color: '#666',
    },
    optionTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    whiteColorCircle: {
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    colorCircleSelected: {
        borderColor: '#528F72',
        borderWidth: 2.5,
        borderStyle: 'solid',
    },
    quantitySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    quantityPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 20,
    },
    quantityBtn: {
        padding: 4,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 8,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    confirmBtn: {
        borderRadius: 25,
        paddingVertical: 6,
        backgroundColor: '#1E1E1E',
    }
});
