import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText, IconButton, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CreateProductDto, Product } from '@/services/product.service';
import { attributeService, Category } from '@/services/attribute.service';

interface ProductFormProps {
    initialData?: Product;
    onSave: (data: CreateProductDto, images: any[]) => Promise<void>;
    loading?: boolean;
    title: string;
    onCancel: () => void;
    extraContent?: React.ReactNode;
}

export function ProductForm({ initialData, onSave, loading = false, title, onCancel, extraContent }: ProductFormProps) {
    const theme = useTheme();
    const [categories, setCategories] = useState<Category[]>([]);
    const [fetchingCats, setFetchingCats] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [images, setImages] = useState<any[]>([]);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadAttributes = async () => {
            setFetchingCats(true);
            try {
                const cats = await attributeService.getCategories();
                setCategories(cats);
                if (cats.length > 0 && !initialData) setCategoryId(cats[0].id);
            } catch (error) {
                console.error('Failed to load attributes', error);
            } finally {
                setFetchingCats(false);
            }
        };
        loadAttributes();
    }, []);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || '');
            setPrice(initialData.basePrice.toString());
            setStatus(initialData.status);
            setCategoryId(initialData.category?.id || null);
            setExistingImages(initialData.images || []);
            setBrand(initialData.brand || '');
        }
    }, [initialData]);

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

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = 'Tên không được để trống';
        if (!price || isNaN(Number(price)) || Number(price) <= 0) e.price = 'Giá không hợp lệ';
        if (!categoryId) e.categoryId = 'Vui lòng chọn danh mục';
        if (!initialData && images.length === 0) e.image = 'Cần ít nhất 1 ảnh sản phẩm';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const productData: CreateProductDto = {
            name: name.trim(),
            description: description.trim(),
            basePrice: Number(price),
            status,
            brand: brand.trim(),
            categoryId: categoryId!,
            variants: []
        };

        await onSave(productData, images);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>{title}</Text>
                    <Button onPress={onCancel}>Hủy</Button>
                </View>

                {extraContent}

                {/* --- BASIC INFO --- */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Thông tin cơ bản</Text>

                        <TextInput
                            label="Tên sản phẩm *"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.name}
                            outlineStyle={styles.inputOutline}
                        />
                        {errors.name && <HelperText type="error" visible={true}>{errors.name}</HelperText>}

                        <TextInput
                            label="Thương hiệu"
                            value={brand}
                            onChangeText={setBrand}
                            mode="outlined"
                            style={styles.input}
                            outlineStyle={styles.inputOutline}
                        />

                        <TextInput
                            label="Mô tả sản phẩm"
                            value={description}
                            onChangeText={setDescription}
                            mode="outlined"
                            multiline
                            numberOfLines={6}
                            style={[styles.input, { height: 120 }]}
                            outlineStyle={styles.inputOutline}
                        />

                        <TextInput
                            label="Giá bán (VND) *"
                            value={price}
                            onChangeText={setPrice}
                            mode="outlined"
                            keyboardType="numeric"
                            style={styles.input}
                            error={!!errors.price}
                            outlineStyle={styles.inputOutline}
                        />
                        {errors.price && <HelperText type="error" visible={true}>{errors.price}</HelperText>}

                        <Text variant="labelLarge" style={styles.label}>Danh mục sản phẩm *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={styles.catItem}
                                    onPress={() => setCategoryId(cat.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.catIconWrap,
                                        categoryId === cat.id && { borderColor: theme.colors.primary, borderWidth: 2 }
                                    ]}>
                                        <Image
                                            source={{ uri: cat.imageUrl || 'https://via.placeholder.com/60' }}
                                            style={styles.catImage}
                                        />
                                    </View>
                                    <Text
                                        variant="bodySmall"
                                        style={[
                                            styles.catName,
                                            categoryId === cat.id && { color: theme.colors.primary, fontWeight: 'bold' }
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {errors.categoryId && <HelperText type="error" visible={true}>{errors.categoryId}</HelperText>}
                    </Card.Content>
                </Card>

                {/* --- IMAGES --- */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>
                            <Button icon="image-plus" mode="text" onPress={pickImage}>Thêm mới</Button>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                            {/* Existing Images (Edit mode only) */}
                            {existingImages.map((img, idx) => (
                                <View key={`exist-${idx}`} style={styles.imageContainer}>
                                    <Image source={{ uri: img.imageUrl }} style={styles.previewImage} />
                                </View>
                            ))}
                            {/* New Selected Images */}
                            {images.map((img, idx) => (
                                <View key={`new-${idx}`} style={styles.imageContainer}>
                                    <Image source={{ uri: img.uri }} style={styles.previewImage} />
                                    <IconButton icon="close-circle" size={20} iconColor="white" style={styles.removeImageBtn} onPress={() => removeImage(idx)} />
                                </View>
                            ))}
                        </ScrollView>
                        {errors.image && <HelperText type="error" visible={true}>{errors.image}</HelperText>}
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={loading}
                    disabled={loading}
                    style={styles.saveBtn}
                    contentStyle={{ paddingVertical: 8 }}
                >
                    {initialData ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    container: { padding: 16, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    card: { marginBottom: 16, backgroundColor: 'white', borderRadius: 12, elevation: 2 },
    sectionTitle: { fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
    input: { marginBottom: 16, backgroundColor: '#fff' },
    inputOutline: { borderRadius: 12 },
    label: { fontWeight: '600', marginTop: 8, marginBottom: 12, color: '#444' },
    categoryScroll: { flexDirection: 'row', marginBottom: 8 },
    catItem: { alignItems: 'center', marginRight: 16, width: 70 },
    catIconWrap: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        padding: 2
    },
    catImage: { width: '100%', height: '100%', borderRadius: 28 },
    catName: { textAlign: 'center', marginTop: 4, fontSize: 11, color: '#666' },
    saveBtn: { marginTop: 24, borderRadius: 12 },
    imageContainer: { width: 100, height: 100, marginRight: 12, position: 'relative' },
    previewImage: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#f0f0f0' },
    removeImageBtn: { position: 'absolute', top: -10, right: -10, backgroundColor: 'rgba(0,0,0,0.5)' }
});
