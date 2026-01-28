import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

interface OrderDetailActionsProps {
    onCancel: () => void;
    cancelling: boolean;
    visible: boolean;
}

const OrderDetailActions: React.FC<OrderDetailActionsProps> = ({ onCancel, cancelling, visible }) => {
    const theme = useTheme();

    if (!visible) return null;

    return (
        <View style={styles.actionSection}>
            <Text style={styles.warningText}>Bạn chỉ có thể hủy đơn hàng trong vòng 30 phút sau khi đặt.</Text>
            <Button
                mode="contained"
                buttonColor={theme.colors.error}
                onPress={onCancel}
                loading={cancelling}
                disabled={cancelling}
                style={{ marginTop: 12 }}
            >
                Hủy Đơn Hàng
            </Button>
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
