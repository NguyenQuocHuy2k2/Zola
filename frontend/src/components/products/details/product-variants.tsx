import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

interface ProductVariantsProps {
    availableColors: any[];
    availableSizes: any[];
    selectedColorId: number | null;
    selectedSizeId: number | null;
    onSelectColor: (id: number) => void;
    onSelectSize: (id: number) => void;
    selectedVariant: any;
}

export default function ProductVariants({
    availableColors,
    availableSizes,
    selectedColorId,
    selectedSizeId,
    onSelectColor,
    onSelectSize,
    selectedVariant,
}: ProductVariantsProps) {
    return (
        <View>
            {/* Color & Size */}
            <View style={styles.specificationsRow}>
                {availableColors.length > 0 && (
                    <View style={styles.specColumn}>
                        <Text style={styles.specTitle}>Màu sắc</Text>
                        <View style={styles.optionsRow}>
                            {availableColors.map((color) => {
                                const isSelected = selectedColorId === color.id;
                                const isWhite = color.hexCode.toUpperCase() === '#FFFFFF' || color.hexCode.toUpperCase() === '#FAFAFA' || color.hexCode.toLowerCase() === 'white';
                                return (
                                    <TouchableOpacity
                                        key={color.id}
                                        onPress={() => onSelectColor(color.id)}
                                        style={[
                                            styles.colorCircle,
                                            { backgroundColor: color.hexCode },
                                            isWhite && styles.whiteColorCircle,
                                            isSelected && styles.colorCircleSelected,
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    </View>
                )}
                {availableSizes.length > 0 && (
                    <View style={styles.specColumn}>
                        <Text style={styles.specTitle}>Size</Text>
                        <View style={styles.optionsRow}>
                            {availableSizes.map((size) => (
                                <TouchableOpacity
                                    key={size.id}
                                    onPress={() => onSelectSize(size.id)}
                                    style={[
                                        styles.sizeCircle,
                                        selectedSizeId === size.id && styles.sizeCircleSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.sizeText,
                                            selectedSizeId === size.id && styles.sizeTextSelected,
                                        ]}
                                    >
                                        {size.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {selectedVariant !== undefined && (
                <Text style={styles.stockText}>
                    {selectedVariant.stockQuantity > 0
                        ? `Còn ${selectedVariant.stockQuantity} sản phẩm`
                        : "Hết hàng"}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    specificationsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginBottom: 8,
    },
    specColumn: { flex: 1 },
    specTitle: {
        fontSize: 14,
        color: "#1E1E1E",
        marginBottom: 12,
        fontWeight: "500",
    },
    optionsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    whiteColorCircle: {
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
    },
    colorCircleSelected: {
        borderColor: '#528F72',
        borderWidth: 2.5,
        borderStyle: 'solid',
    },
    sizeCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FAFAFA",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    sizeCircleSelected: { backgroundColor: "#333333", borderColor: "#333333" },
    sizeText: { fontSize: 13, color: "#8A8A8A", fontWeight: "600" },
    sizeTextSelected: { color: "#FFFFFF" },
    stockText: { fontSize: 13, color: "#528F72", marginBottom: 8 },
});
