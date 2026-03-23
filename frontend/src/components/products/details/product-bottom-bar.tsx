import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface ProductBottomBarProps {
    onAddToCart: () => void;
    addingToCart: boolean;
    isOutOfStock: boolean;
}

export default function ProductBottomBar({
    onAddToCart,
    addingToCart,
    isOutOfStock,
}: ProductBottomBarProps) {
    return (
        <View style={styles.bottomBar}>
            <Button
                mode="contained"
                style={[styles.addToCartBtn, (addingToCart || isOutOfStock) && { opacity: 0.6 }]}
                buttonColor="#528F72"
                onPress={onAddToCart}
                loading={addingToCart}
                disabled={addingToCart || isOutOfStock}
                icon="cart-outline"
                labelStyle={{ fontSize: 16, fontWeight: "bold" }}
            >
                Thêm vào giỏ
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    addToCartBtn: { borderRadius: 30, elevation: 0, paddingVertical: 4 },
});
