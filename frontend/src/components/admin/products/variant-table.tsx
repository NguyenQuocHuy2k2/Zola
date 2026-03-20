import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Card } from 'react-native-paper';
import { ProductVariant } from '@/services/product.service';

interface VariantTableProps {
    variants: ProductVariant[];
    onEdit: (variant: ProductVariant) => void;
    onDelete: (variantId: number) => void;
}

export const VariantTable: React.FC<VariantTableProps> = ({ variants, onEdit, onDelete }) => {
    if (variants.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.tableHeader}>
                <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Kích thước</Text>
                <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Màu sắc</Text>
                <Text style={[styles.columnHeader, { flex: 1, textAlign: 'center' }]}>Số lượng</Text>
                <Text style={[styles.columnHeader, { flex: 1, textAlign: 'right' }]}>Hành động</Text>
            </View>

            {variants.map((v) => {
                const sizeName = v.size?.name || '—';
                const color = v.color;
                
                return (
                    <Card key={v.id} style={styles.variantRowCard} mode="elevated">
                        <View style={styles.rowContent}>
                            <View style={[styles.column, { flex: 1, alignItems: 'center' }]}>
                                <View style={[styles.rowSizeCircle, { backgroundColor: '#333' }]}>
                                    <Text style={styles.rowSizeText}>{sizeName}</Text>
                                </View>
                            </View>
                            <View style={[styles.column, { flex: 1, alignItems: 'center' }]}>
                                <View style={[styles.rowColorCircle, { backgroundColor: color?.hexCode || '#ccc' }]} />
                            </View>
                            <View style={[styles.column, { flex: 1, alignItems: 'center' }]}>
                                <Text style={[styles.cellText, styles.stockText]}>{v.stockQuantity}</Text>
                            </View>
                            <View style={[styles.column, { flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }]}>
                                <IconButton 
                                    icon="pencil-outline" 
                                    size={20} 
                                    iconColor="#2196F3" 
                                    onPress={() => onEdit(v)} 
                                    style={styles.actionIconButton}
                                />
                                <IconButton 
                                    icon="delete-outline" 
                                    size={20} 
                                    iconColor="#F44336" 
                                    onPress={() => onDelete(v.id)} 
                                    style={styles.actionIconButton}
                                />
                            </View>
                        </View>
                    </Card>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    columnHeader: {
        fontSize: 12,
        color: '#8A8A8A',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    variantRowCard: {
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 1,
    },
    rowContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    column: {
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 14,
        color: '#1E1E1E',
        fontWeight: '500',
    },
    stockText: {
        fontWeight: 'bold',
        color: '#528F72',
    },
    actionIconButton: {
        margin: 0,
    },
    rowSizeCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    rowSizeText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "bold",
    },
    rowColorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
});
