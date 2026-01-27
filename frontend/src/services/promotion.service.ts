const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Voucher {
    id: string;
    code: string;
    discountPercentage: number;
    maxDiscount: number;
    minOrderValue: number;
    description: string;
}

const mockVouchers: Voucher[] = [
    {
        id: 'v1', code: 'WELCOME50', discountPercentage: 10, maxDiscount: 50000, minOrderValue: 200000, description: 'Giảm 10% tối đa 50k cho đơn từ 200k'
    },
    {
        id: 'v2', code: 'ZOLA100', discountPercentage: 15, maxDiscount: 100000, minOrderValue: 500000, description: 'Giảm 15% tối đa 100k cho đơn từ 500k'
    }
];

export const promotionService = {
    async getVouchers(): Promise<Voucher[]> {
        await delay(500);
        return mockVouchers;
    },

    async applyVoucher(code: string, orderTotal: number): Promise<{ discountAmount: number, voucher: Voucher }> {
        await delay(600);
        const voucher = mockVouchers.find(v => v.code === code.toUpperCase());
        if (!voucher) {
            throw new Error('Mã giảm giá không hợp lệ');
        }
        if (orderTotal < voucher.minOrderValue) {
            throw new Error(`Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderValue}đ`);
        }

        let discount = orderTotal * (voucher.discountPercentage / 100);
        if (discount > voucher.maxDiscount) {
            discount = voucher.maxDiscount;
        }

        return { discountAmount: discount, voucher };
    },

    async getUserPoints(): Promise<number> {
        await delay(300);
        return 1500; // Mock 1500 zola points
    }
};
