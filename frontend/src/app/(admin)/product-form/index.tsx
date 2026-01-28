import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, SegmentedButtons, HelperText, IconButton, Card, Divider, ActivityIndicator, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Product, getProductById, createProduct, updateProduct, CreateProductDto, CreateProductVariantDto } from '@/services/products/product-service';
import { Category, Size, Color, getCategories, getSizes, getColors } from '@/services/attributes/attribute-service';

export default function ProductForm() {
    const theme = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const isEdit = !!id;

    // Attribute states
    const [categories, setCategories] = useState<Category[]>([]);
    const [availableSizes, setAvailableSizes] = useState<Size[]>([]);
    const [availableColors, setAvailableColors] = useState<Color[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [images, setImages] = useState<any[]>([]); // New selected images
    const [existingImages, setExistingImages] = useState<any[]>([]); // Already uploaded
    const [variants, setVariants] = useState<CreateProductVariantDto[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const loadAttributes = async () => {
        try {
            const [cats, szs, clrs] = await Promise.all([getCategories(), getSizes(), getColors()]);
            setCategories(cats);
            setAvailableSizes(szs);
            setAvailableColors(clrs);
            if (!isEdit && cats.length > 0) setCategoryId(cats[0].id);
        } catch (error) {
            console.error('Failed to load attributes', error);
        }
    };

    const loadProduct = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const product = await getProductById(Number(id));
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.basePrice.toString());
            setStatus(product.status);
            setCategoryId(product.category?.id || null);
            setExistingImages(product.images || []);
            setVariants(product.variants?.map(v => ({
                sizeId: v.size.id,
                colorId: v.color.id,
                stockQuantity: v.stockQuantity
            })) || []);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        loadAttributes();
        if (isEdit) {
            loadProduct();
        }
    }, [id]));

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
            selectionLimit: 5,
            allowsMultipleSelection: true
        });

        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const addVariant = () => {
        if (availableSizes.length === 0 || availableColors.length === 0) {
            Alert.alert('Chưa có thuộc tính', 'Vui lòng thêm Kích cỡ và Màu sắc trước khi cấu hình biến thể.');
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

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = 'Tên không được để trống';
        if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = 'Giá không hợp lệ';
        if (!categoryId) e.categoryId = 'Vui lòng chọn danh mục';
        if (!isEdit && images.length === 0) e.image = 'Cần ít nhất 1 ảnh sản phẩm';
        if (variants.length === 0) e.variants = 'Cần cấu hình ít nhất 1 biến thể (Size/Color)';
        
        // Check duplicate variants
        const variantSet = new Set();
        variants.forEach(v => {
            const key = `${v.sizeId}-${v.colorId}`;
            if (variantSet.has(key)) e.variants = 'Có biến thể bị trùng lặp (Cùng Size và Màu)';
            variantSet.add(key);
        });

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        
        try {
            const productData: CreateProductDto = {
                name: name.trim(),
                description: description.trim(),
                basePrice: Number(price),
                status,
                categoryId: categoryId!,
                variants
            };

            if (isEdit && id) {
                // Currently only basic info update in the mock, full image appending needs robust backend handling
                await updateProduct(Number(id), productData);
                Alert.alert('Thành công', 'Đã cập nhật sản phẩm', [{ text: 'OK', onPress: () => router.back() }]);
            } else {
                await createProduct(JSON.stringify(productData), images);
                Alert.alert('Thành công', 'Đã thêm sản phẩm mới', [{ text: 'OK', onPress: () => router.back() }]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi lưu sản phẩm');
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
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
                        {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
                    </Text>
                    <Button onPress={() => router.back()}>Hủy</Button>
                </View>

                {/* --- BASIC INFO --- */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Thông tin cơ bản</Text>
                        <TextInput label="Tên sản phẩm *" value={name} onChangeText={setName} mode="outlined" style={styles.input} error={!!errors.name} />
                        <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>

                        <TextInput label="Mô tả" value={description} onChangeText={setDescription} mode="outlined" multiline numberOfLines={3} style={styles.input} />

                        <TextInput label="Giá bán (VND) *" value={price} onChangeText={setPrice} mode="outlined" keyboardType="numeric" style={styles.input} error={!!errors.price} />
                        <HelperText type="error" visible={!!errors.price}>{errors.price}</HelperText>

                        <Text variant="bodyMedium" style={styles.label}>Danh mục *</Text>
                        <View style={styles.categoryGrid}>
                            {categories.map((cat: Category) => (
                                <Button key={cat.id} mode={categoryId === cat.id ? 'contained' : 'outlined'} onPress={() => setCategoryId(cat.id)} style={styles.catBtn} compact>
                                    {cat.name}
                                </Button>
                            ))}
                        </View>
                        <HelperText type="error" visible={!!errors.categoryId}>{errors.categoryId}</HelperText>
                    </Card.Content>
                </Card>

                {/* --- IMAGES --- */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>
                            <Button icon="image-plus" mode="text" onPress={pickImage}>Thêm ảnh</Button>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                            {/* Existing Images (Edit mode) */}
                            {existingImages.map((img, idx) => (
                                <View key={`exist-${idx}`} style={styles.imageContainer}>
                                    <Image source={{ uri: img.imageUrl }} style={styles.previewImage} />
                                </View>
                            ))}
                            {/* New Images */}
                            {images.map((img, idx) => (
                                <View key={`new-${idx}`} style={styles.imageContainer}>
                                    <Image source={{ uri: img.uri }} style={styles.previewImage} />
                                    <IconButton icon="close-circle" size={20} iconColor="white" style={styles.removeImageBtn} onPress={() => removeImage(idx)} />
                                </View>
                            ))}
                        </ScrollView>
                        <HelperText type="error" visible={!!errors.image}>{errors.image}</HelperText>
                    </Card.Content>
                </Card>

                {/* --- VARIANTS --- */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Biến thể (Kích cỡ - Màu sắc)</Text>
                            <Button icon="plus" mode="text" onPress={addVariant}>Thêm biến thể</Button>
                        </View>
                        
                        {variants.map((variant, index) => (
                            <View key={index} style={styles.variantRow}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Text variant="labelSmall">Kích cỡ</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {availableSizes.map(s => (
                                            <Chip key={s.id} selected={variant.sizeId === s.id} style={{marginRight: 4}} onPress={() => updateVariant(index, 'sizeId', s.id)}>
                                                {s.name}
                                            </Chip>
                                        ))}
                                    </ScrollView>
                                </View>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Text variant="labelSmall">Màu sắc</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {availableColors.map(c => (
                                            <Chip key={c.id} selected={variant.colorId === c.id} style={{marginRight: 4}} onPress={() => updateVariant(index, 'colorId', c.id)}>
                                                {c.name}
                                            </Chip>
                                        ))}
                                    </ScrollView>
                                </View>
                                <View style={{width: 80}}>
                                    <TextInput label="Tồn kho" value={variant.stockQuantity.toString()} onChangeText={(v) => updateVariant(index, 'stockQuantity', parseInt(v) || 0)} keyboardType="numeric" mode="outlined" style={{height: 40, backgroundColor: 'white'}} />
                                </View>
                                <IconButton icon="minus-circle-outline" iconColor={theme.colors.error} onPress={() => removeVariant(index)} style={{marginTop: 15}} />
                            </View>
                        ))}
                        <HelperText type="error" visible={!!errors.variants}>{errors.variants}</HelperText>
                    </Card.Content>
                </Card>

                <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={styles.saveBtn} contentStyle={{ paddingVertical: 8 }}>
                    {isEdit ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    container: { padding: 16, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    card: { marginBottom: 16, backgroundColor: 'white' },
    sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
    input: { marginBottom: 0, backgroundColor: '#fff' },
    label: { fontWeight: '600', marginTop: 8, marginBottom: 8 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    catBtn: { borderRadius: 8 },
    saveBtn: { marginTop: 8, borderRadius: 10 },
    imageContainer: { width: 100, height: 100, marginRight: 12, position: 'relative' },
    previewImage: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#f0f0f0' },
    removeImageBtn: { position: 'absolute', top: -10, right: -10, backgroundColor: 'rgba(0,0,0,0.5)' },
    variantRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 12 }
});
