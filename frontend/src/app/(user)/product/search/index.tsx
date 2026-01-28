import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Dimensions, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Text, useTheme, Card, ActivityIndicator, IconButton } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { productService, Product, Category, SearchHistory, SearchFilters, Color, Size } from '@/services/product.service';
import FilterModal, { FilterState } from '@/components/products/filter-modal';
import { ProductCard } from '@/components/products/product-card';
import { formatPrice } from '@/utils/format';
import { SearchHeader } from '@/components/products/search-header';
import { SearchHistoryList } from '@/components/products/search-history-list';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 16;

export default function SearchScreen() {
    const theme = useTheme();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [history, setHistory] = useState<SearchHistory[]>([]);
    const [filterVisible, setFilterVisible] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        minPrice: '', maxPrice: '', colorId: null, sizeId: null, category: null
    });
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const [cats, colorsData, sizesData] = await Promise.all([
                    productService.getCategories(),
                    productService.getColors(),
                    productService.getSizes(),
                ]);
                setCategories(cats);
                setColors(colorsData);
                setSizes(sizesData);
                fetchHistory();
            } catch (e) {}
        };
        init();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await productService.getSearchHistory();
            setHistory(res);
        } catch(e) {}
    };

    const handleDeleteHistory = async (id: number) => {
        try {
            await productService.deleteSearchHistory(id);
            fetchHistory();
        } catch (e) {}
    };

    const handleClearHistory = async () => {
        try {
            await productService.clearSearchHistory();
            fetchHistory();
        } catch (e) {}
    };

    const doSearch = (query: string, f: FilterState = filters, pageNumber = 0, append = false) => {
        setIsInputFocused(false);
        Keyboard.dismiss();
        loadProducts(query, f, pageNumber, append);
    };

    const loadProducts = async (query: string, f: FilterState, pageNumber: number, append: boolean = false) => {
        if (pageNumber === 0) {
            setLoading(true);
            setHasSearched(true);
        }
        try {
            const searchPayload: SearchFilters = {
                keyword: query.trim() !== '' ? query.trim() : undefined,
                categoryId: f.category ?? undefined,
                colorId: f.colorId ?? undefined,
                sizeId: f.sizeId ?? undefined,
                minPrice: f.minPrice ? Number(f.minPrice) : undefined,
                maxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
                page: pageNumber,
                size: 20
            };

            const initial = await productService.searchProducts(searchPayload);

            if (pageNumber === 0 && query.trim() !== '') {
                fetchHistory();
            }

            const newContent = initial?.content || (initial as any)?.data || [];
            if (append) {
                setResults(prev => [...prev, ...newContent]);
            } else {
                setResults(newContent);
            }
            setHasMore(newContent.length > 0 && !initial?.last);
            setPage(pageNumber);
        } catch (e) {
            console.error(e);
        } finally {
            if (pageNumber === 0) setLoading(false);
        }
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <ProductCard product={item} />
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <SearchHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={(query) => {
                    setSubmittedQuery(query);
                    setIsInputFocused(false);
                    doSearch(query);
                }}
                onClear={() => {
                    setSearchQuery('');
                    setSubmittedQuery('');
                    setResults([]);
                    setHasSearched(false);
                    Keyboard.dismiss();
                }}
                onFilterPress={() => setFilterVisible(true)}
                isInputFocused={isInputFocused}
                setIsInputFocused={setIsInputFocused}
            />

            <FilterModal 
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                initialFilters={filters}
                categories={categories}
                colors={colors}
                sizes={sizes}
                onApply={(newFilters) => {
                    setFilters(newFilters);
                    setFilterVisible(false);
                    doSearch(submittedQuery, newFilters);
                }}
            />

            {!hasSearched ? (
                <SearchHistoryList
                    history={history}
                    onSearch={(keyword) => {
                        setSearchQuery(keyword);
                        setSubmittedQuery(keyword);
                        doSearch(keyword);
                    }}
                    onDeleteHistory={handleDeleteHistory}
                    onClearHistory={handleClearHistory}
                />
            ) : (
                <>
                    {/* Filters */}
            <View style={{ height: 12 }} />

            {/* Results */}
            {loading ? (
                <ActivityIndicator style={styles.loading} />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    numColumns={2}
                    renderItem={renderProduct}
                    columnWrapperStyle={styles.row}
                    onEndReached={() => {
                        if (hasMore && !loading) {
                            loadProducts(submittedQuery, filters, page + 1, true);
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    contentContainerStyle={results.length === 0 ? styles.emptyContainer : styles.listContent}
                    ListFooterComponent={hasMore && page > 0 ? <ActivityIndicator style={{ margin: 16 }} /> : null}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, opacity: 0.6 }}>
                            Không tìm thấy sản phẩm nào
                        </Text>
                    }
                />
            )}
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
        paddingLeft: 16,
        paddingBottom: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
    },
    listContent: {
        paddingBottom: 24,
    },
    row: {
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    emptyContainer: {
        flexGrow: 1,
    },
    historyChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingLeft: 12,
        paddingRight: 8,
        paddingVertical: 6,
    }
});
