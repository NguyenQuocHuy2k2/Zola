import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Product } from '@/services/product.service';
import { ProductCard } from '../products/product-card';

interface FavoriteListProps {
    products: Product[];
    loadingMore: boolean;
    onLoadMore: () => void;
    onItemPress: (product: Product) => void;
}

export const FavoriteList: React.FC<FavoriteListProps> = ({
    products,
    loadingMore,
    onLoadMore,
    onItemPress,
}) => {
    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
                <ProductCard
                    product={item} 
                    onPress={() => onItemPress(item)} 
                />
            )}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích nào</Text>
                </View>
            }
            ListFooterComponent={
                loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null
            }
        />
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 24,
    },
    row: {
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});
