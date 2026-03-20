import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, IconButton, Card, Chip, Portal, Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { productService, Product, CreateProductDto, CreateProductVariantDto } from '@/services/product.service';
import { attributeService, Size, Color } from '@/services/attribute.service';

export default function StockManagement() {
    const theme = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
    const [availableColors, setAvailableColors] = useState<Color[]>([]);
    const [variants, setVariants] = useState<CreateProductVariantDto[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [tempSizeId, setTempSizeId] = useState<number | null>(null);
    const [tempColorId, setTempColorId] = useState<number | null>(null);

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
            setVariants(p.variants?.map(v => ({
                sizeId: v.size?.id || 0,
                colorId: v.color?.id || 0,
                stockQuantity: v.stockQuantity
            })) || []);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải dữ liệu kho hàng');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        loadData();
    }, [id]));

    const openAddModal = () => {
        if (availableSizes.length === 0 || availableColors.length === 0) {
            Alert.alert('Thiếu dữ liệu', 'Vui lòng cấu hình Kích cỡ và Màu sắc hệ thống trước.');
            return;
        }
        setTempSizeId(availableSizes[0].id);
        setTempColorId(availableColors[0].id);
        setIsAddModalVisible(true);
    };

    const confirmAddVariant = () => {
        if (!tempSizeId || !tempColorId) return;
        
        // Check if combination already exists
        const exists = variants.find(v => v.sizeId === tempSizeId && v.colorId === tempColorId);
        if (exists) {
            Alert.alert('Lỗi', 'Biến thể này đã tồn tại trong danh sách.');
            return;
        }

        setVariants([...variants, { sizeId: tempSizeId, colorId: tempColorId, stockQuantity: 0 }]);
        setIsAddModalVisible(false);
    };

    const updateVariant = (index: number, field: keyof CreateProductVariantDto, value: number) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (variants.length === 0) {
            Alert.alert('Lưu ý', 'Sản phẩm cần có ít nhất 1 biến thể');
            return;
        }

        setSaving(true);
        try {
            const updateData: CreateProductDto = {
                name: product!.name,
                description: product!.description || '',
                basePrice: product!.basePrice,
                status: product!.status,
                categoryId: product!.category.id,
                brand: (product as any).brand || '',
                variants: variants
            };

            await productService.updateProduct(id, updateData);
            Alert.alert('Thành công', 'Đã cập nhật kho hàng', [{ text: 'OK', onPress: () => router.back() }]);
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể lưu thông tin kho hàng');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
                <ActivityIndicator size="large" color="#2E7D32" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <Portal>
                <Modal
                    visible={isAddModalVisible}
                    onDismiss={() => setIsAddModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text variant="titleLarge" style={styles.modalTitle}>Thêm biến thể mới</Text>
                        
                        <View style={styles.modalSection}>
                            <Text variant="labelLarge" style={styles.modalLabel}>Kích cỡ</Text>
                            <View style={styles.optionsRow}>
                                {availableSizes.map(s => (
                                    <TouchableOpacity 
                                        key={s.id} 
                                        onPress={() => setTempSizeId(s.id)}
                                        style={[
                                            styles.sizeCircle,
                                            tempSizeId === s.id && styles.sizeCircleSelected
                                        ]}
                                    >
                                        <Text style={[
                                            styles.sizeText,
                                            tempSizeId === s.id && styles.sizeTextSelected
                                        ]}>
                                            {s.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.modalSection}>
                            <Text variant="labelLarge" style={styles.modalLabel}>Màu sắc</Text>
                            <View style={styles.optionsRow}>
                                {availableColors.map(c => {
                                    const isSelected = tempColorId === c.id;
                                    const isWhite = c.hexCode?.toUpperCase() === '#FFFFFF' || c.hexCode?.toLowerCase() === 'white';
                                    return (
                                        <TouchableOpacity 
                                            key={c.id} 
                                            onPress={() => setTempColorId(c.id)}
                                            style={[
                                                styles.colorCircle,
                                                { backgroundColor: c.hexCode || '#ccc' },
                                                isWhite && styles.whiteColorCircle,
                                                isSelected && styles.colorCircleSelected
                                            ]}
                                        />
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <Button onPress={() => setIsAddModalVisible(false)} textColor="#666">Hủy</Button>
                            <Button 
                                mode="contained" 
                                onPress={confirmAddVariant} 
                                style={styles.confirmBtn}
                            >
                                Xác nhận
                            </Button>
                        </View>
                    </View>
                </Modal>
            </Portal>

            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <Text variant="headlineSmall" style={styles.headerTitle}>Nhập kho & Biến thể</Text>
                    <Text variant="bodySmall" style={styles.subTitle} numberOfLines={1}>{product?.name}</Text>
                </View>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Quay lại</Text>
                </TouchableOpacity>
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

                {variants.map((v, index) => {
                    const sizeName = availableSizes.find(s => s.id === v.sizeId)?.name || '—';
                    const color = availableColors.find(c => c.id === v.colorId);
                    
                    return (
                        <Card key={index} style={styles.variantCard}>
                            <Card.Content style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.variantAttributes}>
                                        <View style={styles.attributeTag}>
                                            <Text style={styles.attributeTagLabel}>Size</Text>
                                            <Text style={styles.attributeTagValue}>{sizeName}</Text>
                                        </View>
                                        <View style={styles.attributeTag}>
                                            <View style={[styles.colorIndicator, { backgroundColor: color?.hexCode || '#ccc' }]} />
                                            <Text style={styles.attributeTagValue}>{color?.name || '—'}</Text>
                                        </View>
                                    </View>
                                    <IconButton 
                                        icon="trash-can-outline" 
                                        iconColor={theme.colors.error} 
                                        onPress={() => removeVariant(index)} 
                                        size={20}
                                        style={styles.deleteIcon}
                                    />
                                </View>

                                <View style={styles.stockSectionRoot}>
                                    <View style={styles.stockLabelContainer}>
                                        <IconButton icon="package-variant-closed" size={16} iconColor="#528F72" style={{margin: 0}} />
                                        <Text variant="labelMedium" style={styles.stockLabel}>Tồn kho thực tế</Text>
                                    </View>
                                    <TextInput
                                        value={v.stockQuantity.toString()}
                                        onChangeText={(val) => updateVariant(index, 'stockQuantity', parseInt(val) || 0)}
                                        keyboardType="numeric"
                                        mode="flat"
                                        style={styles.stockInput}
                                        underlineColor="transparent"
                                        activeUnderlineColor="#528F72"
                                        placeholder="0"
                                        dense
                                    />
                                </View>
                            </Card.Content>
                        </Card>
                    );
                })}

                {variants.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <IconButton icon="layers-plus" size={64} iconColor="#E0E0E0" />
                        <Text variant="bodyLarge" style={styles.emptyText}>Chưa có biến thể nào</Text>
                        <Text variant="bodySmall" style={{color: '#999', marginTop: 4}}>Nhấn nút Thêm mới ở trên để bắt đầu</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.footer}>
                <Button 
                    mode="contained" 
                    onPress={handleSave} 
                    loading={saving} 
                    disabled={saving}
                    style={styles.saveBtn}
                    contentStyle={styles.saveBtnContent}
                >
                    Lưu thay đổi kho hàng
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    headerTitleContainer: { flex: 1 },
    headerTitle: { fontWeight: 'bold', color: '#1E1E1E', fontSize: 20 },
    subTitle: { color: '#8A8A8A', marginTop: 2, fontSize: 13 },
    closeButton: { padding: 8 },
    closeButtonText: { color: '#528F72', fontWeight: 'bold', fontSize: 15 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    sectionHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 20,
    },
    sectionTitle: { fontWeight: 'bold', color: '#1E1E1E' },
    addButton: { borderRadius: 25 },
    variantCard: { 
        marginBottom: 12, 
        borderRadius: 12, 
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardContent: { padding: 14 },
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 14,
    },
    variantAttributes: { flexDirection: 'row', gap: 8 },
    attributeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    attributeTagLabel: { fontSize: 11, color: '#8A8A8A', marginRight: 4, fontWeight: '500' },
    attributeTagValue: { fontSize: 13, fontWeight: 'bold', color: '#1E1E1E' },
    colorIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    deleteIcon: { margin: -8 },
    stockSectionRoot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5'
    },
    stockLabelContainer: { flexDirection: 'row', alignItems: 'center' },
    stockLabel: { color: '#444', fontWeight: '500', marginLeft: 4 },
    stockInput: { backgroundColor: '#F9F9F9', height: 36, width: 80, fontSize: 14, textAlign: 'center' },
    emptyContainer: { padding: 80, alignItems: 'center' },
    emptyText: { color: '#528F72', marginTop: 12, fontWeight: 'bold' },
    footer: { 
        padding: 20, 
        backgroundColor: 'white', 
        borderTopWidth: 1, 
        borderTopColor: '#F0F0F0' 
    },
    saveBtn: { borderRadius: 30, backgroundColor: '#528F72' },
    saveBtnContent: { height: 52 },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 24,
        margin: 20,
        borderRadius: 24,
    },
    modalContent: { gap: 24 },
    modalTitle: { fontWeight: 'bold', color: '#1E1E1E', textAlign: 'center', fontSize: 20 },
    modalSection: {},
    modalLabel: { marginBottom: 12, color: '#1E1E1E', fontWeight: '500', fontSize: 14 },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
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
    sizeCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FAFAFA",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    sizeCircleSelected: { backgroundColor: "#333333", borderColor: "#333333" },
    sizeText: { fontSize: 13, color: "#8A8A8A", fontWeight: "600" },
    sizeTextSelected: { color: "#FFFFFF" },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
    confirmBtn: { borderRadius: 20, backgroundColor: '#528F72', paddingHorizontal: 12 },
    modalBtn: { borderRadius: 10 }
});
