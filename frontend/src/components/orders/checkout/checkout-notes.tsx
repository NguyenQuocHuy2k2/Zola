import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CheckoutNotesProps {
    notes: string;
    setNotes: (notes: string) => void;
}

export const CheckoutNotes = ({
    notes,
    setNotes
}: CheckoutNotesProps) => {
    const theme = useTheme();

    return (
        <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="note-text-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Ghi chú cho đơn hàng</Text>
            </View>
            <TextInput
                mode="outlined"
                placeholder="Ví dụ: Giao sau giờ hành chính, gọi trước khi đến..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                style={styles.notesInput}
                outlineColor="#EAEAEA"
                activeOutlineColor={theme.colors.primary}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
    },
    notesInput: {
        backgroundColor: '#FAFAFA',
        fontSize: 13,
        textAlignVertical: 'top',
        minHeight: 80,
        paddingTop: 12,
        paddingBottom: 12,
    },
});
