import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
import { Text, useTheme, FAB, Searchbar, Chip, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Product, getProducts, deleteProduct } from '@/services/products/product-service';
import { Category, getCategories } from '@/services/attributes/attribute-service';

export default function AdminProducts() {
    const theme = useTheme();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
            setProducts(prods);
            setCategories(cats);
        } catch (error) {
            console.error('Failed to load products', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        loadData();
    }, []));

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: number, name: string) => {
        Alert.alert(
            'Xóa sản phẩm',
            `Bạn có chắc muốn xóa "${name.slice(0, 40)}..."?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa', style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteProduct(id);
                            loadData();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa sản phẩm này');
                        }
                    }
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: Product }) => {
        const primaryImage = item.images?.find(img => img.isPrimary)?.imageUrl || item.images?.[0]?.imageUrl;
        const totalStock = item.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;

        return (
            <View style={styles.row}>
                <Image source={{ uri: primaryImage || 'https://via.placeholder.com/150' }} style={styles.img} />
                <View style={styles.info}>
                    <Text variant="bodyMedium" numberOfLines={2} style={{ fontWeight: '600' }}>{item.name}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.primary, marginTop: 2 }}>
                        {item.basePrice.toLocaleString('vi-VN')}đ
                    </Text>
                    <View style={styles.meta}>
                        <Chip compact icon="tag-outline" style={styles.chip} textStyle={{ fontSize: 11 }}>
                            {item.category?.name || '—'}
                        </Chip>
                        <Text variant="bodySmall" style={styles.soldText}>Tồn: {totalStock}</Text>
                    </View>
                </View>
                <View style={styles.actions}>
                    <IconButton
                        icon="pencil-outline"
                        size={20}
                        onPress={() => router.push({ pathname: '/(admin)/product-form', params: { id: item.id } })}
                    />
                    <IconButton
                        icon="trash-can-outline"
                        size={20}
                        iconColor="#EF4444"
                        onPress={() => handleDelete(item.id, item.name)}
                    />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text variant="headlineSmall" style={styles.title}>Sản phẩm</Text>
                <Searchbar
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.search}
                />
                <Text variant="bodySmall" style={styles.count}>{filtered.length} sản phẩm</Text>
                {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="#fff"
                onPress={() => router.push('/(admin)/product-form')}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    container: { flex: 1, padding: 16 },
    title: { fontWeight: 'bold', marginBottom: 12 },
    search: { marginBottom: 8, backgroundColor: '#fff' },
    count: { color: '#888', marginBottom: 8 },
    row: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center' },
    img: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
    info: { flex: 1, marginLeft: 10 },
    meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 5 },
    chip: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start' },
    soldText: { color: '#888', fontSize: 12 },
    actions: { flexDirection: 'column', alignItems: 'center' },
    separator: { height: 8 },
    fab: { position: 'absolute', right: 16, bottom: 24 },
});
