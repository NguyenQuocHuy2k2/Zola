import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Portal, Modal, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Order, OrderStatus } from '@/services/order.service';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/order';

interface StatusUpdateModalProps {
    visible: boolean;
    onDismiss: () => void;
    order: Order;
    onStatusPress: (status: OrderStatus) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ 
    visible, 
    onDismiss, 
    order, 
    onStatusPress 
}) => {
    const theme = useTheme();

    return (
        <Portal>
            <Modal 
                visible={visible} 
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
            >
                <View style={styles.modalHeader}>
                    <View style={[styles.headerIconContainer, { backgroundColor: '#F0F7FF' }]}>
                        <MaterialCommunityIcons name="sync" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.modalTitle}>Chọn trạng thái mới</Text>
                    <IconButton 
                        icon="close" 
                        size={20} 
                        onPress={onDismiss}
                        style={styles.closeBtn}
                    />
                </View>

                <Text style={styles.modalDescription}>
                    Cập nhật trạng thái hiện tại của đơn hàng. Một số trạng thái có thể yêu cầu lý do hoặc thông tin xác nhận.
                </Text>

                <ScrollView style={styles.reasonScroll} showsVerticalScrollIndicator={false}>
                    {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((status) => {
                        const isCurrent = order.status === status;
                        
                        // Check if transition is valid
                        const isTerminal = order.status === 'CANCELLED' || order.status === 'RECEIVED';
                        const orderMap: Record<OrderStatus, number> = {
                            'PENDING': 0,
                            'CONFIRMED': 1,
                            'PREPARING': 2,
                            'SHIPPING': 3,
                            'RECEIVED': 4,
                            'CANCELLED': 5
                        };
                        
                        const isForward = orderMap[status] > orderMap[order.status];
                        const isCancel = status === 'CANCELLED';
                        const isValid = !isTerminal && (isForward || isCancel) && !isCurrent;
                        const isNext = !isTerminal && orderMap[status] === orderMap[order.status] + 1;

                        return (
                            <TouchableOpacity 
                                key={status} 
                                style={[
                                    styles.reasonOption,
                                    isCurrent && styles.selectedReasonOption,
                                    !isValid && !isCurrent && { opacity: 0.5 }
                                ]}
                                onPress={() => isValid && onStatusPress(status)}
                                activeOpacity={isValid ? 0.7 : 1}
                                disabled={!isValid}
                            >
                                <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[status] }]} />
                                <View style={styles.reasonTextContainer}>
                                    <Text style={[
                                        styles.reasonLabel,
                                        isCurrent && styles.selectedReasonLabel,
                                        isNext && { color: theme.colors.primary, fontWeight: 'bold' }
                                    ]}>
                                        {STATUS_LABEL[status]}
                                        {isNext && " (Tiếp theo)"}
                                    </Text>
                                </View>
                                {isCurrent && (
                                    <MaterialCommunityIcons name="check-circle" size={22} color={theme.colors.primary} />
                                )}
                                {!isValid && !isCurrent && (
                                    <MaterialCommunityIcons name="lock-outline" size={20} color="#BDC3C7" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={[styles.modalFooter, { justifyContent: 'center' }]}>
                    <Button 
                        mode="text" 
                        onPress={onDismiss}
                        style={[styles.footerBtn, { maxWidth: 200 }]}
                        contentStyle={styles.footerBtnContent}
                        textColor="#666"
                    >
                        Đóng
                    </Button>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 20,
        borderRadius: 28,
        maxHeight: '85%',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    headerIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D1D1D',
        flex: 1,
    },
    closeBtn: {
        margin: 0,
        marginRight: -8,
    },
    modalDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        paddingHorizontal: 24,
        marginBottom: 16,
        lineHeight: 20,
    },
    reasonScroll: {
        paddingHorizontal: 16,
        maxHeight: 400,
    },
    reasonOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 8,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    selectedReasonOption: {
        backgroundColor: '#FFF',
        borderColor: '#1D1D1D',
        borderWidth: 1.5,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    reasonTextContainer: {
        flex: 1,
        marginRight: 12,
    },
    reasonLabel: {
        fontSize: 15,
        color: '#2C3E50',
    },
    selectedReasonLabel: {
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 24,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    footerBtn: {
        flex: 1,
        borderRadius: 14,
    },
    footerBtnContent: {
        height: 48,
    },
});

export default StatusUpdateModal;
