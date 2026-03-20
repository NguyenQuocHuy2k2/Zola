import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Portal, Modal } from 'react-native-paper';
import { Size, Color } from '@/services/attribute.service';

interface VariantModalProps {
    visible: boolean;
    onDismiss: () => void;
    editingVariantId: number | null;
    availableSizes: Size[];
    availableColors: Color[];
    saving: boolean;
    onSave: (data: { sizeId: number; colorId: number; quantity: number }) => Promise<void>;
    initialData: { sizeId: number | null; colorId: number | null; quantity: string };
}

export const VariantModal: React.FC<VariantModalProps> = ({
    visible,
    onDismiss,
    editingVariantId,
    availableSizes,
    availableColors,
    saving,
    onSave,
    initialData,
}) => {
    const [tempSizeId, setTempSizeId] = useState<number | null>(initialData.sizeId);
    const [tempColorId, setTempColorId] = useState<number | null>(initialData.colorId);
    const [tempQuantity, setTempQuantity] = useState<string>(initialData.quantity);

    useEffect(() => {
        if (visible) {
            setTempSizeId(initialData.sizeId);
            setTempColorId(initialData.colorId);
            setTempQuantity(initialData.quantity);
        }
    }, [visible, initialData]);

    const handleConfirm = () => {
        if (!tempSizeId || !tempColorId) return;
        onSave({
            sizeId: tempSizeId,
            colorId: tempColorId,
            quantity: parseInt(tempQuantity) || 0,
        });
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={() => !saving && onDismiss()}
                contentContainerStyle={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <Text variant="titleLarge" style={styles.modalTitle}>
                        {editingVariantId ? 'Cập nhật kho hàng' : 'Thêm biến thể mới'}
                    </Text>
                    
                    {!editingVariantId && (
                        <>
                            <View style={styles.modalSection}>
                                <Text variant="labelLarge" style={styles.modalLabel}>Kích cỡ</Text>
                                <View style={styles.optionsRow}>
                                    {availableSizes.map(s => (
                                        <TouchableOpacity 
                                            key={s.id} 
                                            onPress={() => setTempSizeId(s.id)}
                                            style={[
                                                styles.sizeCircle,
                                                tempSizeId === s.id && styles.sizeCircleSelected
                                            ]}
                                        >
                                            <Text style={[
                                                styles.sizeText,
                                                tempSizeId === s.id && styles.sizeTextSelected
                                            ]}>
                                                {s.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.modalSection}>
                                <Text variant="labelLarge" style={styles.modalLabel}>Màu sắc</Text>
                                <View style={styles.optionsRow}>
                                    {availableColors.map(c => {
                                        const isSelected = tempColorId === c.id;
                                        const isWhite = c.hexCode?.toUpperCase() === '#FFFFFF' || c.hexCode?.toLowerCase() === 'white';
                                        return (
                                            <TouchableOpacity 
                                                key={c.id} 
                                                onPress={() => setTempColorId(c.id)}
                                                style={[
                                                    styles.colorCircle,
                                                    { backgroundColor: c.hexCode || '#ccc' },
                                                    isWhite && styles.whiteColorCircle,
                                                    isSelected && styles.colorCircleSelected
                                                ]}
                                            />
                                        );
                                    })}
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.modalSection}>
                        <Text variant="labelLarge" style={styles.modalLabel}>Số lượng tồn kho</Text>
                        <TextInput
                            mode="outlined"
                            value={tempQuantity}
                            onChangeText={setTempQuantity}
                            keyboardType="numeric"
                            style={styles.modalInput}
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#528F72"
                            placeholder="Nhập số lượng"
                        />
                    </View>

                    <View style={styles.modalActions}>
                        <Button onPress={onDismiss} textColor="#666" disabled={saving}>Hủy</Button>
                        <Button 
                            mode="contained" 
                            onPress={handleConfirm} 
                            style={styles.confirmBtn}
                            loading={saving}
                            disabled={saving}
                        >
                            Lưu thay đổi
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        padding: 24,
        margin: 20,
        borderRadius: 24,
    },
    modalContent: { gap: 20 },
    modalTitle: { fontWeight: 'bold', color: '#1E1E1E', textAlign: 'center', fontSize: 18 },
    modalSection: {},
    modalLabel: { marginBottom: 8, color: '#666', fontWeight: '500', fontSize: 13 },
    modalInput: { backgroundColor: '#fff', fontSize: 15 },
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    colorCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
    },
    whiteColorCircle: {
        borderColor: '#E0E0E0',
    },
    colorCircleSelected: {
        borderColor: '#2E7D32',
        borderWidth: 2,
    },
    sizeCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
    sizeCircleSelected: { backgroundColor: "#333", borderColor: "#333" },
    sizeText: { fontSize: 14, color: "#666", fontWeight: "600" },
    sizeTextSelected: { color: "#fff" },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 10 },
    confirmBtn: { borderRadius: 20, backgroundColor: '#528F72' },
});
