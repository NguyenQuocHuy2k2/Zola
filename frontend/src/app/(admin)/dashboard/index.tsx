import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
    const { signOut } = useAuth();

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text variant="headlineSmall" style={styles.title}>Admin Panel</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>Bạn đang đăng nhập với quyền Admin</Text>
                
                <Button 
                    mode="contained" 
                    onPress={signOut}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    Đăng xuất
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { 
        flex: 1, 
        backgroundColor: '#FAFAFA' 
    },
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20 
    },
    title: { 
        fontWeight: 'bold', 
        marginBottom: 8 
    },
    subtitle: { 
        color: '#666', 
        marginBottom: 32,
        textAlign: 'center'
    },
    button: {
        width: '100%',
        maxWidth: 300,
        borderRadius: 12,
    },
    buttonContent: {
        paddingVertical: 8,
    }
});

