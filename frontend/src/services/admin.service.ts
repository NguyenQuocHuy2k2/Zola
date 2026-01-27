import { Product, Category, mockCategories } from './product.service';
import { Order, OrderStatus } from './order.service';

// ─── Products ────────────────────────────────────────────────────────────────

let adminProducts: Product[] = [];

export const adminProductService = {
    getAll(): Product[] {
        return adminProducts;
    },

    getById(id: string): Product | undefined {
        return adminProducts.find(p => p.id === id);
    },

    create(data: Omit<Product, 'id'>): Product {
        const newProduct: Product = {
            ...data,
            id: `prod_${Date.now()}`,
        };
        adminProducts = [newProduct, ...adminProducts];
        return newProduct;
    },

    update(id: string, data: Partial<Product>): Product | null {
        const idx = adminProducts.findIndex(p => p.id === id);
        if (idx === -1) return null;
        adminProducts[idx] = { ...adminProducts[idx], ...data };
        return adminProducts[idx];
    },

    delete(id: string): boolean {
        const before = adminProducts.length;
        adminProducts = adminProducts.filter(p => p.id !== id);
        return adminProducts.length < before;
    },

    getCategories(): Category[] {
        return mockCategories;
    },
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export type AdminOrderStatus = OrderStatus;

export interface AdminOrder extends Order {
    customerName: string;
    customerPhone: string;
    address: string;
}

const statusList: OrderStatus[] = ['NEW', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'];
const names = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Quốc Cường', 'Phạm Minh Đức', 'Hoàng Thị Ế', 'Vũ Quang Phúc'];
const phones = ['0912345678', '0987654321', '0901234567', '0976543210', '0934567890', '0965432109'];
const addresses = [
    '12 Nguyễn Huệ, Q1, TP.HCM',
    '45 Lê Lợi, Q3, TP.HCM',
    '78 Trần Hưng Đạo, Q5, TP.HCM',
    '23 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM',
    '56 Cách Mạng Tháng 8, Q10, TP.HCM',
    '89 Võ Văn Tần, Q3, TP.HCM',
];

let adminOrders: AdminOrder[] = Array.from({ length: 18 }).map((_, i) => {
    const total = (i + 1) * 150000;
    const created = new Date(Date.now() - i * 3600000 * 6).toISOString();

    return {
        id: `order_admin_${i + 1}`,
        customerName: names[i % names.length],
        customerPhone: phones[i % phones.length],
        address: addresses[i % addresses.length],
        items: [],
        total,
        status: statusList[i % statusList.length],
        createdAt: created,
    };
});

export const adminOrderService = {
    getAll(): AdminOrder[] {
        return adminOrders;
    },

    getById(id: string): AdminOrder | undefined {
        return adminOrders.find(o => o.id === id);
    },

    updateStatus(id: string, status: AdminOrderStatus): AdminOrder | null {
        const idx = adminOrders.findIndex(o => o.id === id);
        if (idx === -1) return null;
        adminOrders[idx] = { ...adminOrders[idx], status };
        return adminOrders[idx];
    },
};

// ─── Feedbacks ───────────────────────────────────────────────────────────────

export interface AdminFeedback {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
    isHidden: boolean;
}

const comments = [
    'Sản phẩm rất tốt, đúng mô tả, giao hàng nhanh!',
    'Chất lượng ổn, giá hợp lý. Sẽ mua lại.',
    'Đóng gói cẩn thận, sản phẩm y hình.',
    'Hàng đẹp nhưng giao hơi chậm.',
    'Tuyệt vời! Vượt kỳ vọng của tôi.',
    'Bình thường, không có gì đặc biệt.',
    'Sản phẩm kém chất lượng, không như mô tả.',
    'Shop tư vấn nhiệt tình, sẽ ủng hộ dài dài.',
];

export let adminFeedbacks: AdminFeedback[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `fb_${i + 1}`,
    productId: `prod_${(i % 10) + 1}`,
    productName: `Sản phẩm ${(i % 10) + 1}`,
    productImage: `https://picsum.photos/id/${(i % 50) + 10}/200/200`,
    customerName: names[i % names.length],
    rating: (i % 5) + 1,
    comment: comments[i % comments.length],
    createdAt: new Date(Date.now() - i * 3600000 * 10).toISOString(),
    isHidden: false,
}));

export const adminFeedbackService = {
    getAll(): AdminFeedback[] {
        return adminFeedbacks;
    },

    toggleHide(id: string): AdminFeedback | null {
        const idx = adminFeedbacks.findIndex(f => f.id === id);
        if (idx === -1) return null;
        adminFeedbacks[idx] = { ...adminFeedbacks[idx], isHidden: !adminFeedbacks[idx].isHidden };
        return adminFeedbacks[idx];
    },

    delete(id: string): boolean {
        const before = adminFeedbacks.length;
        adminFeedbacks = adminFeedbacks.filter(f => f.id !== id);
        return adminFeedbacks.length < before;
    },
};
