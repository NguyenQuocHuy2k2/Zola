import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText, IconButton, Card, Chip, Divider } from 'react-native-paper';
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

    const addVariant = () => {
        if (availableSizes.length === 0 || availableColors.length === 0) {
            Alert.alert('Thiếu dữ liệu', 'Vui lòng cấu hình Kích cỡ và Màu sắc hệ thống trước.');
            return;
        }
        setVariants([...variants, { sizeId: availableSizes[0].id, colorId: availableColors[0].id, stockQuantity: 0 }]);
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

        // Check duplicates
        const variantSet = new Set();
        for (const v of variants) {
            const key = `${v.sizeId}-${v.colorId}`;
            if (variantSet.has(key)) {
                Alert.alert('Lỗi', 'Có các biến thể bị trùng lặp (Cùng kích cỡ và màu sắc)');
                return;
            }
            variantSet.add(key);
        }

        setSaving(true);
        try {
            const updateData: CreateProductDto = {
                name: product!.name,
                description: product!.description || '',
                basePrice: product!.basePrice,
                status: product!.status,
                categoryId: product!.category.id,
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
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <View>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Nhập kho & Biến thể</Text>
                    <Text variant="bodySmall" numberOfLines={1}>{product?.name}</Text>
                </View>
                <Button onPress={() => router.back()}>Hủy</Button>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.sectionHeader}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Danh sách biến thể</Text>
                            <Button icon="plus" mode="outlined" onPress={addVariant} compact>Thêm</Button>
                        </View>

                        {variants.map((v, index) => (
                            <View key={index} style={styles.variantRow}>
                                <View style={styles.variantInfo}>
                                    <View style={styles.attributeGroup}>
                                        <Text variant="labelSmall" style={styles.attrLabel}>Kích cỡ</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                            {availableSizes.map(s => (
                                                <Chip 
                                                    key={s.id} 
                                                    selected={v.sizeId === s.id} 
                                                    onPress={() => updateVariant(index, 'sizeId', s.id)}
                                                    style={styles.chip}
                                                    showSelectedCheck={false}
                                                >
                                                    {s.name}
                                                </Chip>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <View style={styles.attributeGroup}>
                                        <Text variant="labelSmall" style={styles.attrLabel}>Màu sắc</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                                            {availableColors.map(c => (
                                                <Chip 
                                                    key={c.id} 
                                                    selected={v.colorId === c.id} 
                                                    onPress={() => updateVariant(index, 'colorId', c.id)}
                                                    style={[styles.chip, v.colorId === c.id && { backgroundColor: c.hexCode + '33' }]}
                                                    showSelectedCheck={false}
                                                    avatar={c.hexCode ? <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c.hexCode }} /> : undefined}
                                                >
                                                    {c.name}
                                                </Chip>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>

                                <View style={styles.stockInputGroup}>
                                    <TextInput
                                        label="Tồn kho"
                                        value={v.stockQuantity.toString()}
                                        onChangeText={(val) => updateVariant(index, 'stockQuantity', parseInt(val) || 0)}
                                        keyboardType="numeric"
                                        mode="outlined"
                                        style={styles.stockInput}
                                        dense
                                    />
                                    <IconButton 
                                        icon="delete-outline" 
                                        iconColor={theme.colors.error} 
                                        onPress={() => removeVariant(index)} 
                                        size={20}
                                    />
                                </View>
                            </View>
                        ))}

                        {variants.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <Text variant="bodyMedium" style={{ color: '#666' }}>Chưa có biến thể nào được tạo.</Text>
                            </View>
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>

            <View style={styles.footer}>
                <Button 
                    mode="contained" 
                    onPress={handleSave} 
                    loading={saving} 
                    disabled={saving}
                    style={styles.saveBtn}
                    contentStyle={{ height: 48 }}
                >
                    Cập nhật kho hàng
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    container: { padding: 16 },
    card: { borderRadius: 12, elevation: 2 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontWeight: 'bold' },
    variantRow: { 
        paddingVertical: 12, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0f0f0',
        marginBottom: 8
    },
    variantInfo: { flex: 1 },
    attributeGroup: { marginBottom: 12 },
    attrLabel: { marginBottom: 4, color: '#666' },
    chipScroll: { flexDirection: 'row' },
    chip: { marginRight: 6, height: 32 },
    stockInputGroup: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: 4
    },
    stockInput: { flex: 1, backgroundColor: 'white', height: 40 },
    emptyContainer: { padding: 40, alignItems: 'center' },
    footer: { 
        padding: 16, 
        backgroundColor: 'white', 
        borderTopWidth: 1, 
        borderTopColor: '#eee' 
    },
    saveBtn: { borderRadius: 8 }
});
