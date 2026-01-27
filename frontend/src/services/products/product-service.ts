import api from '../api';
import { Category, Size, Color } from '../attributes/attribute-service';

export interface ProductVariant {
    id: number;
    product?: Product;
    size: Size;
    color: Color;
    stockQuantity: number;
}

export interface ProductImage {
    id: number;
    imageUrl: string;
    isPrimary: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    status: string;
    category: Category;
    images: ProductImage[];
    variants: ProductVariant[];
}

export interface CreateProductVariantDto {
    sizeId: number;
    colorId: number;
    stockQuantity: number;
}

export interface CreateProductDto {
    name: string;
    description: string;
    basePrice: number;
    status: string;
    categoryId: number;
    variants: CreateProductVariantDto[];
}

// Lấy danh sách sản phẩm
export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data.result;
};

// Admin: Lấy chi tiết sản phẩm
export const getProductById = async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.result;
};

// Admin: Tạo sản phẩm (Hỗ trợ upload ảnh dạng FormData)
export const createProduct = async (productData: string, images: any[]): Promise<Product> => {
    const formData = new FormData();
    formData.append('product', productData); // JSON string of CreateProductDto

    images.forEach(image => {
        formData.append('images', {
            uri: image.uri,
            type: image.mimeType || 'image/jpeg',
            name: image.fileName || `product_image_${Date.now()}.jpg`,
        } as any);
    });

    const response = await api.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.result;
};

// Admin: Cập nhật thông tin cơ bản sản phẩm
export const updateProduct = async (id: number, productData: CreateProductDto): Promise<Product> => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data.result;
};

// Admin: Cập nhật tồn kho (Stock)
export const updateProductStock = async (id: number, stockQuantity: number): Promise<ProductVariant> => {
    const response = await api.put(`/admin/products/variants/${id}/stock`, null, {
        params: { stockQuantity }
    });
    return response.data.result;
};

// Admin: Thêm ảnh cho sản phẩm đã có
export const uploadProductImages = async (productId: number, images: any[]): Promise<ProductImage[]> => {
    const formData = new FormData();
    images.forEach(image => {
        formData.append('images', {
            uri: image.uri,
            type: image.mimeType || 'image/jpeg',
            name: image.fileName || `additional_image_${Date.now()}.jpg`,
        } as any);
    });

    const response = await api.post(`/admin/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.result;
};

// Admin: Xóa sản phẩm
export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
};
