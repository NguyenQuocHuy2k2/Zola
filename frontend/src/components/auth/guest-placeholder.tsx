import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface GuestPlaceholderProps {
    title?: string;
    description?: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const GuestPlaceholder: React.FC<GuestPlaceholderProps> = ({
    title = 'Yêu cầu đăng nhập',
    description = 'Vui lòng đăng nhập để tiếp tục sử dụng tính năng này.',
    icon = 'account-lock-outline',
}) => {
    const theme = useTheme();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name={icon} size={80} color={theme.colors.primary} style={styles.icon} />
            <Text variant="headlineSmall" style={styles.title}>
                {title}
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
                {description}
            </Text>
            <Button
                mode="contained"
                onPress={() => router.push('/(auth)/login')}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                Đăng nhập ngay
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFFFFF',
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    button: {
        width: '100%',
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
});
