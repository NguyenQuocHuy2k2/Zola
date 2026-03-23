import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

interface OrderDetailActionsProps {
    onCancel: () => void;
    onConfirmReceived?: () => void;
    onReview?: () => void;
    cancelling: boolean;
    confirming?: boolean;
    canCancel: boolean;
    canConfirm?: boolean;
    canReview?: boolean;
}

const OrderDetailActions: React.FC<OrderDetailActionsProps> = ({ 
    onCancel, 
    onConfirmReceived, 
    onReview,
    cancelling, 
    confirming, 
    canCancel, 
    canConfirm,
    canReview,
}) => {
    const theme = useTheme();

    if (!canCancel && !canConfirm && !canReview) return null;

    return (
        <View style={styles.actionSection}>
            {canCancel && (
                <>
                    <Text style={styles.warningText}>Bạn chỉ có thể hủy đơn hàng trong vòng 30 phút sau khi đặt.</Text>
                    <Button
                        mode="contained"
                        buttonColor={theme.colors.error}
                        onPress={onCancel}
                        loading={cancelling}
                        disabled={cancelling}
                        style={{ marginTop: 12, borderRadius: 12 }}
                        labelStyle={{ fontWeight: 'bold' }}
                    >
                        Hủy Đơn Hàng
                    </Button>
                </>
            )}
            
            {canConfirm && (
                <Button
                    mode="contained"
                    buttonColor={theme.colors.primary}
                    onPress={onConfirmReceived}
                    loading={confirming}
                    disabled={confirming}
                    style={{ marginTop: 12, borderRadius: 12 }}
                    labelStyle={{ fontWeight: 'bold' }}
                    icon="check-circle-outline"
                >
                    Đã Nhận Hàng
                </Button>
            )}

            {canReview && (
                <Button
                    mode="contained"
                    buttonColor="#F59E0B"
                    onPress={onReview}
                    style={{ marginTop: 12, borderRadius: 12 }}
                    labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                    icon="star-outline"
                >
                    Đánh Giá Sản Phẩm
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    actionSection: {
        padding: 16,
    },
    warningText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

export default OrderDetailActions;
