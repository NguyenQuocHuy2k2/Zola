import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
} from "react-native";
import {
    Text,
    Button,
    ActivityIndicator,
} from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    productService,
    Product,
    ProductVariant,
} from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import { favoriteService } from '@/services/favorite.service';
import { reviewService, Review } from '@/services/review.service';
import ProductSelectionModal from "@/components/products/product-selection-modal";
import StatusModal, { StatusType } from "@/components/ui/status-modal";
import { ProductVariant as ServiceProductVariant } from "@/services/product.service";
import { useAuth } from "@/contexts/AuthContext";

// Modular Components
import ProductImageSection from "@/components/products/details/product-image-section";
import ProductInfo from "@/components/products/details/product-info";
import ProductVariants from "@/components/products/details/product-variants";
import ProductDescription from "@/components/products/details/product-description";
import ProductReviews from "@/components/products/details/product-reviews";
import ProductBottomBar from "@/components/products/details/product-bottom-bar";

const CONTENT_SHEET_OVERLAP = 40;

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

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
                reviewService.getReviewsByProduct(id),
                favoriteService.checkIsFavorite(id),
            ]);
            setProduct(data);
            setReviews(revs);
            setIsFavorite(liked);

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
                <ProductImageSection
                    selectedImageUrl={selectedImageUrl}
                    sortedImages={sortedImages}
                    onSelectImage={setSelectedImageUrl}
                    onBack={handleBack}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite}
                    showFavoriteIcon={!!user}
                    contentSheetOverlap={CONTENT_SHEET_OVERLAP}
                />

                <View style={styles.contentSheet}>
                    <ProductInfo
                        name={product.name}
                        basePrice={product.basePrice}
                        brand={product.brand}
                        categoryName={product.category.name}
                    />

                    <ProductVariants
                        availableColors={availableColors}
                        availableSizes={availableSizes}
                        selectedColorId={selectedColorId}
                        selectedSizeId={selectedSizeId}
                        onSelectColor={(id) => {
                            setSelectedColorId(id);
                            setSelectedSizeId(null);
                        }}
                        onSelectSize={setSelectedSizeId}
                        selectedVariant={selectedVariant}
                    />

                    <ProductDescription
                        description={product.description}
                        isExpanded={isDescExpanded}
                        onToggle={() => setIsDescExpanded(!isDescExpanded)}
                    />

                    <ProductReviews
                        reviews={reviews}
                        isExpanded={isReviewsExpanded}
                        onToggle={() => setIsReviewsExpanded(!isReviewsExpanded)}
                    />
                </View>
            </ScrollView>

            <ProductBottomBar
                onAddToCart={handleAddToCart}
                addingToCart={addingToCart}
                isOutOfStock={selectedVariant !== undefined && selectedVariant.stockQuantity === 0}
            />

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
    contentSheet: {
        backgroundColor: "#FFFFFF",
        marginTop: -CONTENT_SHEET_OVERLAP,
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 20,
    },
});
