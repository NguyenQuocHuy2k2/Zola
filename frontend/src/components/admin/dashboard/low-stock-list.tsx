import { View, StyleSheet } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { Image } from 'expo-image';
import { formatPrice } from '@/utils/format';
import { LowStockProduct } from '@/services/dashboard.service';

export function LowStockList({ products }: { products: LowStockProduct[] }) {
    return (
        <View style={styles.listContainer}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Sắp hết hàng</Text>
            {products.length === 0 ? (
                <Text style={{ color: '#666', marginTop: 8 }}>Không có sản phẩm nào sắp hết hàng.</Text>
            ) : (
                products.map((item, index) => (
                    <Card key={index} style={styles.productCard}>
                        <Card.Content style={styles.productCardContent}>
                            <View style={styles.productImageContainer}>
                                <Image
                                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }}
                                    style={styles.productImage}
                                    contentFit="cover"
                                />
                            </View>
                            <View style={styles.productDetails}>
                                <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                                <Text style={styles.productPrice}>{formatPrice(item.price || 0)}</Text>
                                <View style={styles.badgesRow}>
                                    {item.categoryName && (
                                        <View style={styles.categoryBadge}>
                                            <IconButton icon="tag-outline" size={12} iconColor="#2E7D32" style={styles.badgeIcon} />
                                            <Text style={styles.categoryBadgeText}>{item.categoryName}</Text>
                                        </View>
                                    )}
                                    <View style={styles.stockBadge}>
                                        <Text style={styles.stockText}>Tồn: {item.stockQuantity}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, elevation: 2 },
    sectionTitle: { fontWeight: 'bold' },
    productCard: { marginBottom: 12, backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#F3F4F6' },
    productCardContent: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    productImageContainer: {
        width: 72,
        height: 72,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden'
    },
    productImage: { width: '100%', height: '100%' },
    productDetails: { flex: 1, justifyContent: 'center' },
    productName: { fontWeight: 'bold', fontSize: 15, color: '#333', marginBottom: 4 },
    productPrice: { fontWeight: 'bold', fontSize: 14, color: '#2563EB', marginBottom: 8 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
    categoryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingRight: 10, paddingLeft: 4, paddingVertical: 2, borderRadius: 12 },
    badgeIcon: { margin: 0, padding: 0, width: 16, height: 16 },
    categoryBadgeText: { color: '#2E7D32', fontSize: 11, fontWeight: 'bold' },
    stockBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    stockText: { color: '#E65100', fontWeight: 'bold', fontSize: 11 },
});
