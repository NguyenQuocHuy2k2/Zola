import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
    icon?: string;
}

const { width } = Dimensions.get('window');

export default function ConfirmModal({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    confirmColor,
    icon = 'alert-circle-outline'
}: ConfirmModalProps) {
    const theme = useTheme();
    const activeConfirmColor = confirmColor || theme.colors.primary;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name={icon as any} size={48} color={activeConfirmColor} />
                        </View>
                        
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                        
                        <View style={styles.footer}>
                            <TouchableOpacity 
                                style={styles.cancelBtn} 
                                onPress={onCancel}
                            >
                                <Text style={styles.cancelText}>{cancelLabel}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.confirmBtn, { backgroundColor: activeConfirmColor }]} 
                                onPress={onConfirm}
                            >
                                <Text style={styles.confirmText}>{confirmLabel}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E1E1E',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    footer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    confirmText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
    },
});
