import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { formatPrice } from "@/utils/format";

interface ProductInfoProps {
    name: string;
    basePrice: number;
    brand: string;
    categoryName: string;
}

export default function ProductInfo({
    name,
    basePrice,
    brand,
    categoryName,
}: ProductInfoProps) {
    return (
        <View>
            <View style={styles.titlePriceRow}>
                <Text style={styles.productTitle}>{name}</Text>
                <Text style={styles.productPrice}>
                    {formatPrice(basePrice)}
                </Text>
            </View>

            <Text style={styles.brandText}>
                {brand} · {categoryName}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    titlePriceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    productTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1E1E1E",
        flex: 1,
        marginRight: 16,
    },
    productPrice: { fontSize: 20, fontWeight: "bold", color: "#1E1E1E" },
    brandText: { fontSize: 13, color: "#8A8A8A", marginTop: 6, marginBottom: 4 },
});
