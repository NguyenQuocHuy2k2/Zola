import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { GuestPlaceholder } from '@/components/auth/guest-placeholder';

export default function OrdersLayout() {
    const { user } = useAuth();

    if (!user) {
        return (
            <GuestPlaceholder
                title="Đơn hàng của tôi"
                description="Vui lòng đăng nhập để theo dõi và xem lại lịch sử đơn hàng của bạn."
                icon="clipboard-text-outline"
            />
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="[id]/index"
                options={{ tabBarStyle: { display: 'none' } }}
            />
        </Stack>
    );
}
