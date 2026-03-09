import { Stack } from 'expo-router';

export default function OrdersLayout() {
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
