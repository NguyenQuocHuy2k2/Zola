import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';

interface NotificationHeaderProps {
    title: string;
    onMarkAllAsRead: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({ title, onMarkAllAsRead }) => {
    const theme = useTheme();

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <IconButton
                icon="check-all"
                size={22}
                iconColor={theme.colors.primary}
                onPress={onMarkAllAsRead}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
});
