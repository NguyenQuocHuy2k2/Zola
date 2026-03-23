import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Portal, Modal, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CancellationReason, CancellationReasonResponse } from '@/services/order.service';

interface CancellationReasonModalProps {
    visible: boolean;
    onDismiss: () => void;
    reasons: CancellationReasonResponse[];
    selectedReason: CancellationReason | null;
    setSelectedReason: (reason: CancellationReason) => void;
    onConfirm: () => void;
    onBack: () => void;
    updating: boolean;
}

const CancellationReasonModal: React.FC<CancellationReasonModalProps> = ({
    visible,
    onDismiss,
    reasons,
    selectedReason,
    setSelectedReason,
    onConfirm,
    onBack,
    updating,
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
                    <View style={styles.headerIconContainer}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={32} color={theme.colors.error} />
                    </View>
                    <Text style={styles.modalTitle}>Lý do hủy đơn hàng</Text>
                    <IconButton 
                        icon="close" 
                        size={20} 
                        onPress={onDismiss}
                        style={styles.closeBtn}
                    />
                </View>

                <Text style={styles.modalDescription}>
                    Vui lòng chọn lý do hủy đơn hàng này. Thao tác này sẽ cập nhật trạng thái đơn hàng thành "Đã hủy".
                </Text>

                <ScrollView style={styles.reasonScroll} showsVerticalScrollIndicator={false}>
                    {reasons.map((reason) => {
                        const isSelected = selectedReason === reason.code;
                        return (
                            <TouchableOpacity 
                                key={reason.code} 
                                style={[
                                    styles.reasonOption,
                                    isSelected && styles.selectedReasonOption
                                ]}
                                onPress={() => setSelectedReason(reason.code)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.reasonTextContainer}>
                                    <Text style={[
                                        styles.reasonLabel,
                                        isSelected && styles.selectedReasonLabel
                                    ]}>
                                        {reason.label}
                                    </Text>
                                </View>
                                <MaterialCommunityIcons 
                                    name={isSelected ? "radiobox-marked" : "radiobox-blank"} 
                                    size={22} 
                                    color={isSelected ? theme.colors.primary : "#BDC3C7"} 
                                />
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.modalFooter}>
                    <Button 
                        mode="outlined" 
                        onPress={onBack}
                        style={styles.footerBtn}
                        contentStyle={styles.footerBtnContent}
                        textColor="#666"
                    >
                        Quay lại
                    </Button>
                    <Button 
                        mode="contained" 
                        onPress={onConfirm}
                        style={[styles.footerBtn, styles.confirmBtn]}
                        contentStyle={styles.footerBtnContent}
                        disabled={!selectedReason || updating}
                        loading={updating}
                        buttonColor={theme.colors.error}
                    >
                        Xác nhận hủy
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
        backgroundColor: '#FFF5F5',
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
    confirmBtn: {
        elevation: 0,
    },
});

export default CancellationReasonModal;
