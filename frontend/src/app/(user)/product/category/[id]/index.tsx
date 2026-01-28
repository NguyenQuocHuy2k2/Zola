import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    Category,
    getProductPrimaryImage,
    Product,
    productService,
} from '@/services/product.service';
import { ProductCard } from '@/components/products/product-card';
import { formatPrice } from '@/utils/format';
import { CategoryHeader } from '@/components/category/category-header';
import { CategoryFilter } from '@/components/category/category-filter';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 16;

export default function CategoryScreen() {
    const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
    const router = useRouter();

    const categoryId = Number(id);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(categoryId);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const currentCategoryName = useMemo(() => {
        const found = categories.find(c => c.id === selectedCategoryId);
        return found?.name ?? name ?? 'Danh mục';
    }, [categories, selectedCategoryId, name]);

    // Load categories for filter chips
    useEffect(() => {
        productService.getCategories().then(setCategories).catch(console.error);
    }, []);

    // Reset & load when selectedCategoryId changes
    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
        loadPage(0, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategoryId]);

    const loadPage = useCallback(
        async (pageNum: number, reset = false) => {
            if (reset) setLoading(true);
            else setLoadingMore(true);
            try {
                const res = await productService.getProductsByCategory(selectedCategoryId, pageNum, 10);
                setProducts(prev => (reset ? res.content : [...prev, ...res.content]));
                setHasMore(!res.last);
                setPage(pageNum);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [selectedCategoryId],
    );

    const loadMore = () => {
        if (loadingMore || !hasMore) return;
        loadPage(page + 1);
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <ProductCard product={item} />
    );

    const renderHeader = () => (
        <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
        />
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />

            <CategoryHeader title={currentCategoryName} />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    renderItem={renderProduct}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.row}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không có sản phẩm nào.</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    foundLabel: { fontSize: 14, color: '#999999' },
    foundCount: { fontSize: 22, fontWeight: '700', color: '#1E1E1E', marginTop: 2 },
    listContent: { paddingBottom: 24 },
    row: {
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        marginBottom: 12
    },
    emptyText: { textAlign: 'center', marginTop: 60, opacity: 0.5, fontSize: 15 },
});
