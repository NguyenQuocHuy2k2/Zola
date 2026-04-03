import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                <ActivityIndicator color="#528F72" size="large" />
            </View>
        );
    }

    if (user?.role === 'ADMIN') {
        return <Redirect href="/(admin)" />;
    }

    return <Redirect href="/(user)" />;
}
