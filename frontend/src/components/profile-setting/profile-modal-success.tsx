import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProfileModalProps {
    visible: boolean;
    success: boolean;
    message: string;
    onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    visible,
    success,
    message,
    onClose,
}) => {
    const theme = useTheme();

    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                    <View style={[styles.modalIconContainer, { backgroundColor: success ? '#F0FFF4' : '#FFF0F0' }]}>
                        <MaterialCommunityIcons
                            name={success ? 'check-circle' : 'alert-circle'}
                            size={48}
                            color={success ? '#4CAF50' : '#F44336'}
                        />
                    </View>
                    <Text style={styles.modalTitle}>
                        {success ? 'Thành công!' : 'Có lỗi xảy ra'}
                    </Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <TouchableOpacity
                        style={[styles.modalBtn, { backgroundColor: success ? theme.colors.primary : '#F44336' }]}
                        onPress={onClose}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.modalBtnText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 32,
        paddingHorizontal: 28,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },
    modalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1D1D1D',
        marginBottom: 8,
    },
    modalMessage: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    modalBtn: {
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 48,
    },
    modalBtnText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
