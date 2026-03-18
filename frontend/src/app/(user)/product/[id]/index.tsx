import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import {
    Text,
    Button,
    IconButton,
    ActivityIndicator,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    productService,
    Product,
    ProductVariant,
} from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import { favoriteService, Review } from '@/services/favorite.service';
import { formatPrice } from "@/utils/format";
import ProductSelectionModal from "@/components/products/product-selection-modal";
import StatusModal, { StatusType } from "@/components/ui/status-modal";
import { ProductVariant as ServiceProductVariant } from "@/services/product.service";

const { width } = Dimensions.get("window");
const CONTENT_SHEET_OVERLAP = 40;

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
    const [isDescExpanded, setIsDescExpanded] = useState(true);
    const [isReviewsExpanded, setIsReviewsExpanded] = useState(true);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectionModalVisible, setSelectionModalVisible] = useState(false);

    // Status Modal State
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusType, setStatusType] = useState<StatusType>('success');
    const [statusTitle, setStatusTitle] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        if (id) loadProduct();
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const [data, revs, liked] = await Promise.all([
                productService.getProductById(id),
                favoriteService.getReviews(id),
                favoriteService.checkIsFavorite(id),
            ]);
            setProduct(data);
            setReviews(revs);
            setIsFavorite(liked);

            console.log(data);

            // Default selected image (primary first)
            const primaryImg =
                data.images.find((img) => img.isPrimary) ?? data.images[0];
            if (primaryImg) setSelectedImageUrl(primaryImg.imageUrl);

            // Default selections
            const firstColor = data.variants.find((v) => v.color)?.color;
            const firstSize = data.variants.find((v) => v.size)?.size;
            if (firstColor) setSelectedColorId(firstColor.id);
            if (firstSize) setSelectedSizeId(firstSize.id);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Images sorted: primary first
    const sortedImages = useMemo(() => {
        if (!product) return [];
        return [...product.images].sort(
            (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
        );
    }, [product]);

    // Unique colors from variants
    const availableColors = useMemo(() => {
        if (!product) return [];
        const seen = new Set<number>();
        return product.variants
            .filter((v) => v.color && !seen.has(v.color.id) && seen.add(v.color.id))
            .map((v) => v.color!);
    }, [product]);

    // Sizes available for selected color
    const availableSizes = useMemo(() => {
        if (!product) return [];
        const seen = new Set<number>();
        return product.variants
            .filter(
                (v) =>
                    v.size &&
                    v.color?.id === selectedColorId &&
                    !seen.has(v.size.id) &&
                    seen.add(v.size.id),
            )
            .map((v) => v.size!);
    }, [product, selectedColorId]);

    // Selected variant
    const selectedVariant = useMemo<ProductVariant | undefined>(() => {
        if (!product) return undefined;
        return product.variants.find(
            (v) => v.color?.id === selectedColorId && v.size?.id === selectedSizeId,
        );
    }, [product, selectedColorId, selectedSizeId]);

    const handleToggleFavorite = async () => {
        if (!product) return;
        const newStatus = await favoriteService.toggleFavorite(product);
        setIsFavorite(newStatus);
    };

    const handleAddToCart = () => {
        setSelectionModalVisible(true);
    };

    const handleConfirmSelection = async (variant: ServiceProductVariant, quantity: number) => {
        setSelectionModalVisible(false);
        setAddingToCart(true);
        try {
            await cartService.addToCart(product!.id, variant.id, quantity);
            showStatus('success', 'Thành công!', 'Sản phẩm đã được thêm vào giỏ hàng của bạn.');
        } catch {
            showStatus('error', 'Thất bại!', 'Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
        } finally {
            setAddingToCart(false);
        }
    };

    const showStatus = (type: StatusType, title: string, message: string) => {
        setStatusType(type);
        setStatusTitle(title);
        setStatusMessage(message);
        setStatusModalVisible(true);
    };


    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centerContainer}>
                <Text>Không tìm thấy sản phẩm</Text>
                <Button onPress={handleBack} style={{ marginTop: 16 }}>
                    Quay lại
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Image Section */}
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
                            style={styles.thumbnailStrip}
                            contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
                        >
                            {sortedImages.map((img) => (
                                <TouchableOpacity
                                    key={img.id}
                                    onPress={() => setSelectedImageUrl(img.imageUrl)}
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
                            onPress={handleBack}
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
                            onPress={handleToggleFavorite}
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

                {/* Content Section */}
                <View style={styles.contentSheet}>
                    <View style={styles.titlePriceRow}>
                        <Text style={styles.productTitle}>{product.name}</Text>
                        <Text style={styles.productPrice}>
                            {formatPrice(product.basePrice)}
                        </Text>
                    </View>

                    <Text style={styles.brandText}>
                        {product.brand} · {product.category.name}
                    </Text>

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
                                                onPress={() => {
                                                    setSelectedColorId(color.id);
                                                    setSelectedSizeId(null);
                                                }}
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
                                            onPress={() => setSelectedSizeId(size.id)}
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

                    {/* Description */}
                    <TouchableOpacity
                        style={styles.accordionHeader}
                        onPress={() => setIsDescExpanded(!isDescExpanded)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sectionTitle}>Mô tả</Text>
                        <IconButton
                            icon={isDescExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            style={{ margin: 0 }}
                        />
                    </TouchableOpacity>
                    {isDescExpanded && (
                        <View style={styles.accordionContent}>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>
                    )}

                    {/* Reviews */}
                    <TouchableOpacity
                        style={[styles.accordionHeader, { marginTop: 16 }]}
                        onPress={() => setIsReviewsExpanded(!isReviewsExpanded)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.sectionTitle}>Đánh giá ({reviews.length})</Text>
                        <IconButton
                            icon={isReviewsExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            style={{ margin: 0 }}
                        />
                    </TouchableOpacity>
                    {isReviewsExpanded && (
                        <View style={styles.accordionContent}>
                            {reviews.length === 0 ? (
                                <Text style={{ opacity: 0.6, marginTop: 8 }}>
                                    Chưa có đánh giá nào.
                                </Text>
                            ) : (
                                reviews.map((rev) => (
                                    <View key={rev.id} style={styles.reviewItem}>
                                        <View style={styles.reviewItemHeader}>
                                            <Image
                                                source={{
                                                    uri: "https://i.pravatar.cc/150?u=" + rev.id,
                                                }}
                                                style={styles.reviewAvatar}
                                            />
                                            <View style={{ flex: 1, marginLeft: 12 }}>
                                                <Text style={styles.reviewUserName}>
                                                    {rev.userName}
                                                </Text>
                                                <Text style={styles.reviewStars}>
                                                    {"★".repeat(rev.rating)}
                                                    <Text style={{ color: "#E0E0E0" }}>
                                                        {"★".repeat(5 - rev.rating)}
                                                    </Text>
                                                </Text>
                                            </View>
                                            <Text style={styles.reviewTimeText}>
                                                {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                                            </Text>
                                        </View>
                                        <Text style={styles.reviewCommentText}>{rev.comment}</Text>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <Button
                    mode="contained"
                    style={[styles.addToCartBtn, (addingToCart || (selectedVariant !== undefined && selectedVariant.stockQuantity === 0)) && { opacity: 0.6 }]}
                    buttonColor="#528F72"
                    onPress={handleAddToCart}
                    loading={addingToCart}
                    disabled={
                        addingToCart ||
                        (selectedVariant !== undefined &&
                            selectedVariant.stockQuantity === 0)
                    }
                    icon="cart-outline"
                    labelStyle={{ fontSize: 16, fontWeight: "bold" }}
                >
                    Thêm vào giỏ
                </Button>
            </View>

            {product && (
                <ProductSelectionModal
                    visible={selectionModalVisible}
                    product={product}
                    onClose={() => setSelectionModalVisible(false)}
                    onConfirm={handleConfirmSelection}
                />
            )}

            <StatusModal
                visible={statusModalVisible}
                type={statusType}
                title={statusTitle}
                message={statusMessage}
                onClose={() => setStatusModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    scrollContent: { paddingBottom: 24 },
    imageContainer: {
        position: "relative",
        width: "100%",
        backgroundColor: "#F7F7F7",
    },
    productImage: { width: width, height: width * 1.1 },
    thumbnailStrip: {
        position: "absolute",
        bottom: CONTENT_SHEET_OVERLAP,
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
    contentSheet: {
        backgroundColor: "#FFFFFF",
        marginTop: -CONTENT_SHEET_OVERLAP,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 20,
    },
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
    stockText: { fontSize: 13, color: "#528F72", marginBottom: 8 },
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
    accordionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1E1E1E" },
    accordionContent: { paddingTop: 16 },
    descriptionText: { fontSize: 14, color: "#8A8A8A", lineHeight: 22 },
    reviewItem: { marginBottom: 24 },
    reviewItemHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
    reviewUserName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1E1E1E",
        marginBottom: 2,
    },
    reviewStars: { fontSize: 12, color: "#439775" },
    reviewTimeText: { fontSize: 12, color: "#C0C0C0" },
    reviewCommentText: { fontSize: 14, color: "#666666", lineHeight: 20 },
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
