import React, { useRef } from 'react';
import { View, TextInput, TouchableWithoutFeedback, StyleSheet, Text } from 'react-native';

interface OtpInputProps {
    value: string;
    onChange: (text: string) => void;
    length?: number;
    primaryColor?: string;
    autoFocus?: boolean;
}

export default function OtpInput({
    value,
    onChange,
    length = 6,
    primaryColor = '#16A34A',
    autoFocus = false,
}: OtpInputProps) {
    const inputRef = useRef<TextInput>(null);

    const digits = Array.from({ length }, (_, i) => value[i] || '');

    const isCellFocused = (index: number) =>
        value.length === index || (value.length >= length && index === length - 1);

    return (
        <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
            <View style={styles.wrapper}>
                <View style={styles.cells}>
                    {digits.map((digit, i) => (
                        <View
                            key={i}
                            style={[
                                styles.cell,
                                isCellFocused(i)
                                    ? [styles.cellFocused, { borderColor: primaryColor, shadowColor: primaryColor }]
                                    : digit
                                    ? [styles.cellFilled, { borderColor: primaryColor + '66' }]
                                    : styles.cellEmpty,
                            ]}
                        >
                            <Text style={styles.digit}>{digit}</Text>
                        </View>
                    ))}
                </View>

                <TextInput
                    ref={inputRef}
                    value={value}
                    onChangeText={text => onChange(text.replace(/[^0-9]/g, '').slice(0, length))}
                    keyboardType="number-pad"
                    maxLength={length}
                    caretHidden
                    autoFocus={autoFocus}
                    style={styles.hiddenInput}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    cells: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    cell: {
        width: 46,
        height: 54,
        borderRadius: 12,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellEmpty: {
        borderColor: '#E0E0E0',
        backgroundColor: '#F7F7F7',
    },
    cellFocused: {
        borderWidth: 2,
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 4,
    },
    cellFilled: {
        borderWidth: 1.5,
        backgroundColor: '#FFFFFF',
    },
    digit: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1D1D1D',
        textAlign: 'center',
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1,
    },
});
