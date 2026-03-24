import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, ActivityIndicator, IconButton, Text } from 'react-native-paper';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { cartService, CartItem } from '@/services/cart.service';
import { orderService, PaymentMethod } from '@/services/order.service';
import voucherService, { Voucher } from '@/services/voucher.service';
import { formatPrice, formatFullAddress } from '@/utils/format';
import { addressService, Address } from '@/services/address.service';
import { profileService } from '@/services/profile.service';
import { AddressSelectionModal } from '@/components/address/address-selection-modal';
import { VoucherSelectionModal } from '@/components/voucher/voucher-selection-modal';
import StatusModal, { StatusType } from '@/components/ui/status-modal';
import ConfirmModal from '@/components/ui/confirm-modal';

// Subcomponents
import { CheckoutInfo } from '@/components/orders/checkout/checkout-info';
import { CheckoutItems } from '@/components/orders/checkout/checkout-items';
import { CheckoutPayment } from '@/components/orders/checkout/checkout-payment';
import { CheckoutNotes } from '@/components/orders/checkout/checkout-notes';
import { CheckoutSummary } from '@/components/orders/checkout/checkout-summary';
import { CheckoutBottomBar } from '@/components/orders/checkout/checkout-bottom-bar';

export default function CheckoutScreen() {
    const { ids } = useLocalSearchParams<{ ids: string }>();
    const theme = useTheme();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
    const [notes, setNotes] = useState('');

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<{ discount: number, voucher: Voucher } | null>(null);
    const [applyingVoucher, setApplyingVoucher] = useState(false);
    const [voucherModalVisible, setVoucherModalVisible] = useState(false);

    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusConfig, setStatusConfig] = useState<{ type: StatusType, title: string, message: string }>({
        type: 'success',
        title: '',
        message: ''
    });
    const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

    useEffect(() => {
        loadCart();
    }, [ids]);

    const loadCart = async () => {
        setLoading(true);
        try {
            const [allItems, userProfile, userAddresses] = await Promise.all([
                cartService.getCart(),
                profileService.getMyProfile(),
                addressService.getMyAddresses()
            ]);
            
            // Handle Items
            let displayItems: CartItem[] = [];
            if (ids) {
                const idsStr = Array.isArray(ids) ? ids[0] : ids;
                const selectedIds = idsStr.split(',').filter((id: string) => id.length > 0);
                displayItems = allItems.filter(item => selectedIds.includes(item.id));
            }
            setCartItems(displayItems);

            if (displayItems.length === 0) {
                router.replace('/cart');
                return;
            }

            // Handle Profile & Addresses
            setPhone(userProfile.phone || '');
            setAddresses(userAddresses);
            
            const defAddress = userAddresses.find(a => a.isDefault) || userAddresses[0];
            if (defAddress) {
                setSelectedAddressId(defAddress.id);
                setAddress(formatFullAddress(defAddress));
            }
        } catch (error) {
            console.error('Failed to load checkout data', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSelectAddress = (addr: Address) => {
        setSelectedAddressId(addr.id);
        setAddress(formatFullAddress(addr));
        setAddressModalVisible(false);
    };

    const totalItemPrice = cartItems.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);
    const finalTotal = Math.max(0, totalItemPrice - (appliedVoucher?.discount || 0));

    const handleApplyVoucher = async () => {
        if (!voucherCode) return;
        setApplyingVoucher(true);
        try {
            const result = await voucherService.applyVoucher(voucherCode, totalItemPrice);
            setAppliedVoucher({ discount: result.discountAmount, voucher: result.voucher });
            setStatusConfig({
                type: 'success',
                title: 'Thành công',
                message: 'Áp dụng mã giảm giá thành công'
            });
            setStatusModalVisible(true);
        } catch (e: any) {
            setStatusConfig({
                type: 'error',
                title: 'Lỗi',
                message: e.message || 'Mã không hợp lệ'
            });
            setStatusModalVisible(true);
            setAppliedVoucher(null);
        } finally {
            setApplyingVoucher(false);
        }
    };

    const handleSelectVoucher = (voucher: Voucher) => {
        setVoucherCode(voucher.code);
        setAppliedVoucher({
            discount: voucher.discountType === 'FIXED' 
                ? voucher.discountValue 
                : Math.min(totalItemPrice * (voucher.discountValue / 100), voucher.maxDiscountAmount || Infinity),
            voucher
        });
        setVoucherModalVisible(false);
    };

    const handleCheckout = async () => {
        if (!address) {
            setStatusConfig({
                type: 'error',
                title: 'Lỗi',
                message: 'Vui lòng nhập địa chỉ giao hàng'
            });
            setStatusModalVisible(true);
            return;
        }
        if (!phone) {
            setStatusConfig({
                type: 'error',
                title: 'Lỗi',
                message: 'Vui lòng nhập số điện thoại'
            });
            setStatusModalVisible(true);
            return;
        }

        setConfirmModalVisible(true);
    };

    const processCheckout = async () => {
        setConfirmModalVisible(false);
        setSubmitting(true);
        try {
            const order = await orderService.createOrder({
                shippingAddress: address,
                phoneNumber: phone,
                paymentMethod: paymentMethod,
                notes: notes,
                cartItemIds: cartItems.map(i => i.id),
                voucherCode: appliedVoucher?.voucher.code
            });
            
            setCreatedOrderId(order.id);
            setStatusConfig({
                type: 'success',
                title: 'Thành công',
                message: 'Đặt hàng thành công! Trạng thái đơn hàng đang chờ xác nhận.'
            });
            setStatusModalVisible(true);
        } catch (error: any) {
            setStatusConfig({
                type: 'error',
                title: 'Lỗi',
                message: error.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt hàng'
            });
            setStatusModalVisible(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setStatusModalVisible(false);
        if (statusConfig.type === 'success' && createdOrderId) {
            router.replace({
                pathname: '/orders',
                params: { status: 'PENDING' }
            });
        }
    };


    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <IconButton icon="chevron-left" size={28} onPress={() => router.back()} style={styles.backBtn} />
                <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <CheckoutInfo
                    address={address}
                    phone={phone}
                    setPhone={setPhone}
                    onOpenAddressModal={() => setAddressModalVisible(true)}
                />

                <CheckoutItems
                    cartItems={cartItems}
                    voucherCode={voucherCode}
                    setVoucherCode={setVoucherCode}
                    handleApplyVoucher={handleApplyVoucher}
                    applyingVoucher={applyingVoucher}
                    appliedVoucher={appliedVoucher}
                    onOpenVoucherModal={() => setVoucherModalVisible(true)}
                />

                <CheckoutPayment
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />

                <CheckoutNotes
                    notes={notes}
                    setNotes={setNotes}
                />

                <CheckoutSummary
                    totalItemPrice={totalItemPrice}
                    discountAmount={appliedVoucher?.discount || 0}
                    finalTotal={finalTotal}
                />
            </ScrollView>

            <CheckoutBottomBar
                finalTotal={finalTotal}
                submitting={submitting}
                onCheckout={handleCheckout}
            />

            <AddressSelectionModal
                visible={addressModalVisible}
                onClose={() => setAddressModalVisible(false)}
                onSelect={handleSelectAddress}
                currentAddressId={selectedAddressId || undefined}
            />

            <VoucherSelectionModal
                visible={voucherModalVisible}
                onClose={() => setVoucherModalVisible(false)}
                onSelect={handleSelectVoucher}
                selectedVoucherId={appliedVoucher?.voucher.id}
                orderTotal={totalItemPrice}
            />

            <StatusModal
                visible={statusModalVisible}
                type={statusConfig.type}
                title={statusConfig.title}
                message={statusConfig.message}
                buttonLabel={(statusConfig.type === 'success' && createdOrderId) ? 'Xem đơn hàng' : 'Đóng'}
                onClose={handleModalClose}
            />

            <ConfirmModal
                visible={confirmModalVisible}
                title="Xác nhận đặt hàng"
                message={`Bạn có chắc chắn muốn đặt đơn hàng này với tổng số tiền ${formatPrice(finalTotal)}?`}
                onConfirm={processCheckout}
                onCancel={() => setConfirmModalVisible(false)}
                confirmLabel="ĐẶT HÀNG"
                cancelLabel="QUAY LẠI"
                icon="cart-outline"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: {
        backgroundColor: '#F8F9FA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        gap: 16,
    },
});
