import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { GuestPlaceholder } from '@/components/auth/guest-placeholder';

export default function NotificationLayout() {
    const { user } = useAuth();

    if (!user) {
        return (
            <GuestPlaceholder
                title="Thông báo"
                description="Vui lòng đăng nhập để nhận và xem các thông báo cá nhân dành cho bạn."
                icon="bell-outline"
            />
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}
