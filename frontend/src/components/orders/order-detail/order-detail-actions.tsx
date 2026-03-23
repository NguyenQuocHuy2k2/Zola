import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

interface OrderDetailActionsProps {
    onCancel: () => void;
    onConfirmReceived?: () => void;
    cancelling: boolean;
    confirming?: boolean;
    canCancel: boolean;
    canConfirm?: boolean;
}

const OrderDetailActions: React.FC<OrderDetailActionsProps> = ({ 
    onCancel, 
    onConfirmReceived, 
    cancelling, 
    confirming, 
    canCancel, 
    canConfirm 
}) => {
    const theme = useTheme();

    if (!canCancel && !canConfirm) return null;

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
