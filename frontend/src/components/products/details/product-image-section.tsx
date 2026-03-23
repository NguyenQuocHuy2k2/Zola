import React from "react";
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { IconButton } from "react-native-paper";

const { width } = Dimensions.get("window");

interface ProductImageSectionProps {
    selectedImageUrl: string | null;
    sortedImages: any[];
    onSelectImage: (url: string) => void;
    onBack: () => void;
    onToggleFavorite: () => void;
    isFavorite: boolean;
    contentSheetOverlap: number;
}

export default function ProductImageSection({
    selectedImageUrl,
    sortedImages,
    onSelectImage,
    onBack,
    onToggleFavorite,
    isFavorite,
    contentSheetOverlap,
}: ProductImageSectionProps) {
    return (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: selectedImageUrl ?? undefined }}
                style={styles.productImage}
                resizeMode="cover"
            />
            {sortedImages.length > 1 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={[styles.thumbnailStrip, { bottom: contentSheetOverlap }]}
                    contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
                >
                    {sortedImages.map((img) => (
                        <TouchableOpacity
                            key={img.id}
                            onPress={() => onSelectImage(img.imageUrl)}
                            style={[
                                styles.thumbnailItem,
                                selectedImageUrl === img.imageUrl &&
                                styles.thumbnailSelected,
                            ]}
                        >
                            <Image
                                source={{ uri: img.imageUrl }}
                                style={styles.thumbnailImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            <View style={styles.headerButtons}>
                <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={onBack}
                >
                    <IconButton
                        icon="chevron-left"
                        size={24}
                        iconColor="#1E1E1E"
                        style={{ margin: 0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.headerBtn, { padding: 4 }]}
                    onPress={onToggleFavorite}
                >
                    <IconButton
                        icon={isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        iconColor={isFavorite ? "#FF5252" : "#1E1E1E"}
                        style={{ margin: 0 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        position: "relative",
        width: "100%",
        backgroundColor: "#F7F7F7",
    },
    productImage: { width: width, height: width * 1.1 },
    thumbnailStrip: {
        position: "absolute",
        left: 0,
        right: 0,
        paddingVertical: 8,
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    thumbnailItem: {
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "transparent",
    },
    thumbnailSelected: { borderColor: "#FFFFFF" },
    thumbnailImage: { width: 60, height: 60 },
    headerButtons: {
        position: "absolute",
        top: 48,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    headerBtn: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
});
