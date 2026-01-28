import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Text, IconButton, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Color, Size } from '@/services/product.service';

export interface FilterState {
    minPrice: string;
    maxPrice: string;
    colorId: number | null;
    sizeId: number | null;
    category: number | null;
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    initialFilters: FilterState;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

export default function FilterModal({
    visible,
    onClose,
    onApply,
    initialFilters,
    categories,
    colors,
    sizes
}: FilterModalProps) {
    const theme = useTheme();
    const [filters, setFilters] = useState<FilterState>(initialFilters);

    const handleReset = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            colorId: null,
            sizeId: null,
            category: null,
        });
    };

    const toggleColor = (id: number) => {
        setFilters(prev => ({
            ...prev,
            colorId: prev.colorId === id ? null : id
        }));
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Filter</Text>
                            <IconButton icon="close" onPress={onClose} />
                        </View>

                        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                            {/* Category Section */}
                            <View style={styles.section}>
                                <Text variant="titleMedium" style={styles.sectionTitle}>Danh mục</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                                    <TouchableOpacity
                                        style={[styles.chip, filters.category === null && styles.chipActive]}
                                        onPress={() => setFilters(prev => ({ ...prev, category: null }))}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.chipText, filters.category === null && styles.chipTextActive]}>
                                            Tất cả
                                        </Text>
                                    </TouchableOpacity>
                                    {categories.map(item => {
                                        const isActive = item.id === filters.category;
                                        return (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[styles.chip, isActive && styles.chipActive]}
                                                onPress={() => setFilters(prev => ({ ...prev, category: item.id }))}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>

                            {/* Price Section */}
                            <View style={styles.section}>
                                <Text variant="titleMedium" style={styles.sectionTitle}>Price range ($)</Text>
                                <View style={styles.priceInputs}>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="Min"
                                        keyboardType="numeric"
                                        value={filters.minPrice}
                                        onChangeText={(text) => setFilters(prev => ({ ...prev, minPrice: text }))}
                                    />
                                    <Text style={{ marginHorizontal: 12 }}>-</Text>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="Max"
                                        keyboardType="numeric"
                                        value={filters.maxPrice}
                                        onChangeText={(text) => setFilters(prev => ({ ...prev, maxPrice: text }))}
                                    />
                                </View>
                            </View>

                            {/* Color Section */}
                            <View style={styles.section}>
                                <Text variant="titleMedium" style={styles.sectionTitle}>Màu sắc</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {colors.map(color => {
                                        const isSelected = filters.colorId === color.id;
                                        const isWhite = color.hexCode.toUpperCase() === '#FFFFFF';
                                        return (
                                            <TouchableOpacity
                                                key={color.id}
                                                onPress={() => toggleColor(color.id)}
                                                style={[
                                                    styles.colorCircle,
                                                    { backgroundColor: color.hexCode },
                                                    isWhite && styles.whiteColorCircle,
                                                    isSelected && styles.colorCircleSelected
                                                ]}
                                            />
                                        )
                                    })}
                                </ScrollView>
                            </View>

                            {/* Size Section */}
                            <View style={styles.section}>
                                <Text variant="titleMedium" style={styles.sectionTitle}>Kích thước</Text>
                                <View style={styles.discountGrid}>
                                    {sizes.map(size => {
                                        const isSelected = filters.sizeId === size.id;
                                        return (
                                            <TouchableOpacity
                                                key={size.id}
                                                onPress={() => setFilters(prev => ({ ...prev, sizeId: isSelected ? null : size.id }))}
                                                style={[
                                                    styles.discountChip,
                                                    isSelected && { backgroundColor: '#1E1E1E', borderColor: '#1E1E1E' }
                                                ]}
                                            >
                                                <Text style={{ color: isSelected ? 'white' : '#1E1E1E' }}>
                                                    {size.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                            <View style={{ height: 40 }} />
                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                                <Text style={styles.resetText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(filters)}>
                                <Text style={styles.applyText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    content: {
        paddingHorizontal: 20,
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        marginBottom: 12,
        fontWeight: 'bold',
    },
    priceInputs: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    colorCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    whiteColorCircle: {
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    colorCircleSelected: {
        borderColor: '#3a7435ff',
        borderWidth: 2.5,
        borderStyle: 'solid',
    },
    discountGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    discountChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        alignItems: 'center',
    },
    resetBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
    },
    resetText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    applyBtn: {
        flex: 2,
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        alignItems: 'center',
        paddingVertical: 14,
    },
    applyText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryScroll: {
        gap: 8,
        paddingBottom: 4,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    chipActive: {
        backgroundColor: '#1E1E1E',
        borderColor: '#1E1E1E',
    },
    chipText: { fontSize: 13, color: '#555555', fontWeight: '500' },
    chipTextActive: { color: '#FFFFFF' },
});
