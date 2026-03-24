import api from './api';

export enum DiscountType {
    FIXED = 'FIXED',
    PERCENTAGE = 'PERCENTAGE'
}

export enum VoucherStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    USED = 'USED'
}

export interface Voucher {
    id: string;
    code: string;
    discountValue: number;
    discountType: DiscountType;
    minOrderAmount: number;
    maxDiscountAmount?: number;
    startDate: string;
    expiryDate: string;
    status: VoucherStatus;
    description: string;
    createdAt: string;
}

const voucherService = {
    getMyVouchers: async (): Promise<Voucher[]> => {
        const response = await api.get('/vouchers/my');
        return response.data.result;
    },

    getVoucherByCode: async (code: string): Promise<Voucher> => {
        const response = await api.get(`/vouchers/${code}`);
        return response.data.result;
    },

    applyVoucher: async (code: string, orderTotal: number): Promise<{ discountAmount: number, voucher: Voucher }> => {
        const voucher = await voucherService.getVoucherByCode(code.toUpperCase());
        
        if (voucher.status !== VoucherStatus.ACTIVE) {
            throw new Error('Mã giảm giá không còn khả dụng');
        }

        if (orderTotal < voucher.minOrderAmount) {
            throw new Error(`Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderAmount.toLocaleString()}đ`);
        }

        // Check expiry
        const now = new Date();
        const expiryDate = new Date(voucher.expiryDate);
        if (now > expiryDate) {
            throw new Error('Mã giảm giá đã hết hạn');
        }

        let discount = 0;
        if (voucher.discountType === DiscountType.FIXED) {
            discount = voucher.discountValue;
        } else {
            discount = orderTotal * (voucher.discountValue / 100);
            if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
                discount = voucher.maxDiscountAmount;
            }
        }

        return { discountAmount: discount, voucher };
    }
};

export default voucherService;
