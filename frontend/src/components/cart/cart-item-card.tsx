import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { CartItem } from '@/services/cart.service';
import { getProductPrimaryImage } from '@/services/product.service';
import { formatPrice } from '@/utils/format';

interface CartItemCardProps {
    item: CartItem;
    isSelected: boolean;
    onToggleSelection: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onNavigateToProduct: (productId: string) => void;
    onRemove: (id: string) => void;
}

export default function CartItemCard({
    item,
    isSelected,
    onToggleSelection,
    onUpdateQuantity,
    onNavigateToProduct,
    onRemove
}: CartItemCardProps) {
    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const trans = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity
                onPress={() => onRemove(item.id)}
                activeOpacity={0.6}
            >
                <Animated.View
                    style={[
                        styles.deleteAction,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}
                >
                    <MaterialCommunityIcons name="trash-can-outline" size={28} color="white" />
                    <Text style={styles.deleteText}>Xóa</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.swipeContainer}>
            <Swipeable
                renderRightActions={renderRightActions}
                friction={2}
                rightThreshold={40}
                containerStyle={styles.swipeableInternal}
            >
                <View style={styles.cardContainer}>
                    <TouchableOpacity onPress={() => onNavigateToProduct(item.product.id)}>
                        <Image
                            source={{ uri: getProductPrimaryImage(item.product) }}
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <View style={styles.itemInfo}>
                        <View style={styles.titleRow}>
                            <Text numberOfLines={1} style={styles.itemName}>{item.product.name}</Text>
                            <TouchableOpacity
                                onPress={() => onToggleSelection(item.id)}
                                style={[
                                    styles.checkbox,
                                    isSelected ? styles.checkboxSelected : styles.checkboxUnselected
                                ]}
                                activeOpacity={0.7}
                            >
                                {isSelected ? (
                                    <MaterialCommunityIcons name="check" size={14} color="white" />
                                ) : null}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.itemPrice}>{formatPrice(item.product.basePrice)}</Text>

                        <View style={styles.bottomRow}>
                            <Text style={styles.variantText} numberOfLines={1}>
                                Size: {item.variant.size?.name ?? 'N/A'} | Màu: {item.variant.color?.name ?? 'N/A'}
                            </Text>
                            <View style={styles.quantityPill}>
                                <TouchableOpacity
                                    onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    style={styles.iconBtn}
                                >
                                    <MaterialCommunityIcons name="minus" size={16} color="#666" />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    style={styles.iconBtn}
                                >
                                    <MaterialCommunityIcons name="plus" size={16} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Swipeable>
        </View>
    );
}

const styles = StyleSheet.create({
    swipeContainer: {
        marginBottom: 16,
        paddingHorizontal: 2, // Breathing room for shadow
    },
    swipeableInternal: {
        borderRadius: 20,
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'visible',
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
        flex: 1,
        marginRight: 8,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
    },
    checkboxSelected: {
        backgroundColor: '#16A34A',
        borderColor: '#16A34A',
    },
    checkboxUnselected: {
        backgroundColor: '#FCFCFC',
        borderColor: '#E0E0E0',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#16A34A',
        marginTop: 6,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    variantText: {
        fontSize: 12,
        color: '#888',
        flex: 1,
        marginRight: 10,
    },
    quantityPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7F9',
        borderRadius: 20,
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    iconBtn: {
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '700',
        paddingHorizontal: 10,
        color: '#222',
        minWidth: 30,
        textAlign: 'center',
    },
    deleteAction: {
        backgroundColor: '#FF5252',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
        borderRadius: 20,
        marginLeft: 12,
    },
    deleteText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
});
